const ip_model = require("../../model/ip_model");

async function getComparisonIpValue(str) {
  var rest = (await str.substring(0, str.lastIndexOf(".") + 1)) + "0";
  console.log(rest);
  return rest;
}

const saveIp = async (req, res) => {
  try {
    // const ip = req.ip;
    // const ip = req.body.ip;
    const ipModel = new ip_model();
    ipModel.ip = req.body.ip//await getComparisonIpValue(ip);
    ipModel.floor = req.body.floor;
    if (await ip_model.findOne({ ip: ipModel.ip }))
      res.status(500).send(`Already exist your Ip`);
    else {
      await ipModel.save({});
      res.status(200).send(`Save your Ip: ${ipModel}`);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Invalid to saveIP", Error: err });
  }
};

const showRegisteredIp = async (req, res) => {
  try {
    const ips = await ip_model.find({}).distinct("ip");
    if (ips) res.status(200).send(ips);
    else res.status(200).send({ ips: "No register ip" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Invalid to show registerIP", Error: err });
  }
};
module.exports = { saveIp, showRegisteredIp };
