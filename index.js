const axios = require('axios').default;
const { v4: uuidv4 } = require('uuid');

module.exports = async function (context, req) {
    let key = "<KEY>";
    let endpoint = "https://api.cognitive.microsofttranslator.com";
    let location = "<REGION>";

    try {
        context.log(req.method == 'GET' ? req.query.text : req.body.text)
        const response = await axios({
            baseURL: endpoint,
            url: '/translate',
            method: 'post',
            headers: {
                'Ocp-Apim-Subscription-Key': key,
                'Ocp-Apim-Subscription-Region': location,
                'Content-type': 'application/json',
                'X-ClientTraceId': uuidv4().toString()
            },
            params: {
                'api-version': '3.0',
                'from': req.query.from,
                'to': req.query.to
            },
            data: [{
                'text': req.method == 'GET' ? req.query.text : req.body.text || "Please ask with text"//'I would really like to drive your car around the block a few times!'
            }],
            responseType: 'json'
        });

        context.res = {
            status: 200,
            body: JSON.stringify(response.data, null, 4)
        };
    } catch (error) {
        context.res = {
            status: error.response.status || 500,
            body: error.response.data || error.message
        };
    }
};
