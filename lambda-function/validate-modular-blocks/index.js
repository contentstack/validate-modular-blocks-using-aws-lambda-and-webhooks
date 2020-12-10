// Module Dependency

const axios = require("axios");

const {
  managementToken,
  baseUrl,
  stageRejectedUid,
  stageApprovedUid,
} = process.env;

//handler to update workflow stage to "Rejected"
const updateStageToReject = async (
  apiKey,
  stageUid,
  contentTypeUid,
  uid,
  userId
) => {
  let options = {
    method: "POST",
    data: {
      workflow: {
        workflow_stage: {
          uid: stageUid,
          assigned_to: [
            {
              uid: userId,
            },
          ],
          comment:
            "The entry got rejected as the modular blocks Banner & Disclaimer where out of occurrence or not present.Please re-evaluate the blocks and update the entry.",
          notify: true,
        },
      },
    },
    json: true,
    headers: {
      "content-Type": "application/json",
      Authorization: managementToken,
      api_key: apiKey,
    },
  };
  let response = await axios(
    `${baseUrl}v3/content_types/${contentTypeUid}/entries/${uid}/workflow`,
    options
  );
  return Promise.resolve(response.data);
};

//handler to update workflow stage to "Approved"
const updateStageToApproved = async (apiKey, stageUid, contentTypeUid, uid) => {
  let options = {
    method: "POST",
    data: {
      workflow: {
        workflow_stage: {
          uid: stageUid,
          comment:
            "The entry got approved as the modular blocks Banner & Disclaimer has valid number of occurrences.",
        },
      },
    },
    json: true,
    headers: {
      "content-Type": "application/json",
      Authorization: managementToken,
      api_key: apiKey,
    },
  };
  let response = await axios(
    `${baseUrl}v3/content_types/${contentTypeUid}/entries/${uid}/workflow`,
    options
  );
  return Promise.resolve(response.data);
};

// validate handler
const validateHandler = async (apiKey, data) => {
  let blockObj = {};
  let modularObj = "";
  data.content_type.schema.map((index) => {
    if (index.data_type === "blocks") {
      modularObj = index.uid;
      index.blocks.map((key) => {
        blockObj[key.uid] = 0;
      });
    }
  });
  data.entry[modularObj].map((index) => {
    blockObj[Object.keys(index)[0]] = blockObj[Object.keys(index)[0]] + 1;
  });
  if (blockObj.banner > 0 && blockObj.banner <= 3 && blockObj.disclaimer == 1) {
    await updateStageToApproved(
      apiKey,
      stageApprovedUid,
      data.content_type.uid,
      data.entry.uid,
      data
    );
  } else {
    await updateStageToReject(
      apiKey,
      stageRejectedUid,
      data.content_type.uid,
      data.entry.uid,
      data.entry.updated_by
    );
  }
};

exports.handler = async (event) => {
  let body = JSON.parse(event.body);
  try {
    await validateHandler(body.api_key, body.data);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Blocks Validated" }),
    };
  } catch (e) {
    console.log(e);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message }),
    };
  }
};
