const https = require("https");
const url = require("url");

exports.handler = (event, context, callback) => {
  const request = event.Records[0].cf.request;

  // Construct the URL for the Lambda function
  const lambdaUrl =
    "https://uuojvnj7bigwganm2yd74atcja0bdyyn.lambda-url.us-east-1.on.aws" +
    request.uri;
  const parsedUrl = url.parse(lambdaUrl);

  // Prepare headers for the HTTPS request
  const headers = {};
  Object.keys(request.headers).forEach((key) => {
    headers[key] = request.headers[key][0].value;
  });

  // Options for the HTTPS request
  const options = {
    hostname: parsedUrl.hostname,
    path: parsedUrl.path,
    method: request.method,
    headers: headers,
  };

  // Make a request to the Lambda URL
  const req = https.request(options, (res) => {
    let body = "";

    res.on("data", (chunk) => {
      body += chunk;
    });

    res.on("end", () => {
      // Construct the response object
      const response = {
        status: res.statusCode.toString(),
        statusDescription: res.statusMessage,
        headers: {},
        body: body,
      };

      // Convert headers to CloudFront format
      Object.keys(res.headers).forEach((key) => {
        response.headers[key.toLowerCase()] = [
          {
            key: key,
            value: res.headers[key],
          },
        ];
      });

      // Send the response back to CloudFront
      callback(null, response);
    });
  });

  req.on("error", (e) => {
    // Handle any errors
    callback(null, {
      status: "500",
      statusDescription: "Internal Server Error",
      body: e.message,
    });
  });

  // If there's a body in the original request, write it to the new request
  if (request.body && request.body.data) {
    req.write(request.body.data);
  }

  req.end();
};
