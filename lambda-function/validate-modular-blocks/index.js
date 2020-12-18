// Module Dependency

const axios = require("axios");

const {
  managementToken,
  baseUrl,
  stageRejectedUid,
  stageApprovedUid,
} = process.env;

//axios instance
const contentstackAxios = axios.create({
  baseURL: baseUrl,
  method: "POST",
  headers: {
    "content-type": "application/json",
    Authorization: `${managementToken}`,
  },
});

//handler to update workflow stage to "Rejected"
const updateStageToReject = async (stageUid, contentTypeUid, uid, userId) => {
  let options = {
    url: `v3/content_types/${contentTypeUid}/entries/${uid}/workflow`,
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
  };
  let response = await contentstackAxios(options);
  return Promise.resolve(response.data);
};

//handler to update workflow stage to "Approved"
const updateStageToApproved = async (stageUid, contentTypeUid, uid) => {
  let options = {
    url: `v3/content_types/${contentTypeUid}/entries/${uid}/workflow`,
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
  };
  let response = await contentstackAxios(options);
  return Promise.resolve(response.data);
};

// validate handler
const validateHandler = async (data) => {
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
      stageApprovedUid,
      data.content_type.uid,
      data.entry.uid
    );
  } else {
    await updateStageToReject(
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
    contentstackAxios.interceptors.request.use(
      (config) => {
        if (body.api_key) {
          config.headers["api_key"] = body.api_key;
        }
        return config;
      },
      (error) => {
        Promise.reject(error);
      }
    );
    await validateHandler(body.data);
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
