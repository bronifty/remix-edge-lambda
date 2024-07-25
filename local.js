import { handler, app } from "./lambda.cjs";
import { normalizeRequest } from "./normalize-request.js";
import apigRequest from "./events/apig.js";
import cloudfrontRequest from "./events/cloudfront.js";

async function main(event) {
  const normalizedRequest = normalizeRequest(event);
  const result = await handler(normalizedRequest);
  console.log(result);
}

main(apigRequest);
main(cloudfrontRequest);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
