const User = require('../models/user');
const Withdrawal = require('../models/withdrawal');
const bcrypt = require('bcryptjs');
const Recharge = require('../models/recharge');
const { getNewAddress, sendToAddress, getTransaction } = require('../utils/doge');
const { verifyPassword } = require('../utils/authentication');

//get wallet address
exports.getWallet = async (req, res, next) => {
  // console.log(req.user);
  const user = await User.findById(req.user.id);
  try {
    if (!user.address) {
      const respond = await getNewAddress();
      if (respond && respond.body.error == null) {
        // console.log(respond.body.result);
        user.address = respond.body.result;
      }
    }
  } catch (err) {
    console.log(err);
  }

  await user.save();
  res.status(200).json({ wallet: user.address });
};
//generate the btc new address
exports.getNewAddress = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  try {
    const now = new Date().getTime();
    if (now - user.updatedAt > 300000) {
      const respond = await getNewAddress();
      if (respond.body.error == null) {
        user.address = respond.body.result;
        user.updatedAt = new Date().getTime();
        await user.save();
        res.status(200).json({ wallet: user.address });
      } else {
        res.status(400).json({ error: 'Try again 5 minutes later' });
      }
    } else {
      res.status(400).json({ error: 'Try again 5 minutes later' });
    }
  } catch (err) {
    // console.log(err);
    res.status(400).json({ error: 'Try again 5 minutes later' });
  }
};

exports.postWithdrawal = async (req, res, next) => {
  const amount = req.body.doge;
  const address = req.body.wallet;
  let user = await User.findById(req.user.id);
  if (amount < 10000)
    return res.status(400).json({ error: `Only more than 10,000 doge credits allowed to withdraw` });
  else if (user.doge < amount) {
    return res.status(403).json({ error: `Not enough balance` });
  }

  const passwordValid = await verifyPassword(req.body.password, user.password);

  if (passwordValid) {
    const recharges = await Recharge.find({ user: user.id });
    for (let i = 0; i < recharges.length; i++) {
      console.log(recharges[i].txid);
      const respond = await getTransaction(recharges[i].txid);
      console.log(respond.body);
      if (respond.body.error != null || respond.body.result.confirmations < 6) {
        return res.status(401).json({
          error:
            'In order to withdraw, all of the transactions must have more than 6 confirmations!'
        });
      }
    }
    user.my_address = address;
    await user.save();

    if (amount > 0) {
      const respond = await sendToAddress(address, amount/100);
      if (respond.body && respond.body.error == null) {
        const comp = {};
        comp.user = user.id;
        comp.address = address;
        comp.amount = amount;
        comp.txid = respond.body.result;
        user = await User.findByIdAndUpdate(
          req.user.id,
          {
            $inc: {
              doge: -Number(amount)
            }
          },
          { new: true }
        );
        await new Withdrawal(comp).save();
        return res
          .status(200)
          .json({ message: 'Withdraw successfully! txid=' + comp.txid, doge: user.doge });
      }
    }
    return res.status(400).json({
      error: 'Withdrawal failed!'
    });
  } else return res.status(401).json({ error: 'Password incorrect!' });
};

exports.getAdminWithdrawal = async (req, res, next) => {
  const page = req.params.page;
  let withdrawals, total;
  //all
  withdrawals = await Withdrawal.find({})
    .sort('-createdAt')
    .skip((page - 1) * 20)
    .limit(20);
  total = await Withdrawal.countDocuments({});

  const res_data = [];
  for (var i = 0; i < withdrawals.length; i++) {
    try {
      const respond = await getTransaction(withdrawals[i].txid);
      withdrawals[i].confirmations=respond.body.result.confirmations;
      await withdrawals[i].save();
      const aa = await User.findById(withdrawals[i].user);
      res_data[i] = {};
      res_data[i].id = withdrawals[i].id;
      res_data[i].createdAt = withdrawals[i].createdAt;
      res_data[i].username = aa.username;
      res_data[i].amount = withdrawals[i].amount;
      res_data[i].address = withdrawals[i].address;
      res_data[i].txid = withdrawals[i].txid;
      res_data[i].confirmations = withdrawals[i].confirmations;
    } catch (ex) {
      continue;
    }
  }
  return res.status(200).json({ data: res_data, page, last_page: Math.ceil(total / 20) });
};

exports.deleteAdminWithdrawal = async (req, res, next) => {
  const withdrawal=await Withdrawal.findById(req.params.id);
  await User.findByIdAndUpdate(
    withdrawal.user,
    {
      $inc: {
        doge: Number(withdrawal.amount)
      }
    },
    { new: true }
  );
  await withdrawal.remove();
  return res.status(200).json({ message:"Successfully removed!" });

};

exports.deleteAdminRecharge = async (req, res, next) => {
  const recharge=await Recharge.findById(req.params.id);
  await User.findByIdAndUpdate(
    recharge.user,
    {
      $inc: {
        doge: -Number(recharge.amount)
      }
    },
    { new: true }
  );
  await recharge.remove();
  return res.status(200).json({ message:"Successfully removed!" });

};

exports.getAdminRecharge = async (req, res, next) => {
  const page = req.params.page;
  const status = req.params.status ? req.params.status : 2;
  let recharges;
  // if (status == 2 ) {
  recharges = await Recharge.find({})
    .sort('-createdAt')
    .skip((page - 1) * 20)
    .limit(20);
  // } else {
  //     recharges = await Recharge.find({ status: status }).sort("-createdAt").skip((page - 1) * 20).limit(20);
  // }
  const total = await Recharge.countDocuments({});
  const res_data = [];
  for (var i = 0; i < recharges.length; i++) {
    try {
      const respond = await getTransaction(recharges[i].txid);
      recharges[i].confirmations=respond.body.result.confirmations;
      await recharges[i].save();
      const aa = await User.findById(recharges[i].user);
      res_data[i] = {};
      res_data[i].id = recharges[i].id;
      res_data[i].txid = recharges[i].txid;
      res_data[i].createdAt = recharges[i].createdAt;
      res_data[i].userId = aa.id;
      res_data[i].username = aa.username;
      res_data[i].amount = recharges[i].amount;
      res_data[i].confirmations = recharges[i].confirmations;
    } catch (ex) {
      continue;
    }
  }
  return res.status(200).json({
    data: res_data,
    page: page,
    last_page: Math.ceil(total / 20)
  });
};

exports.getWithdrawalList = async (req, res, next) => {
  const page = req.params.page;
  const withdrawals = await Withdrawal.find({ user: req.user.id });
  const data=[];
  for(let i=0;i<withdrawals.length;i++){
    const respond = await getTransaction(withdrawals[i].txid);
    withdrawals[i].confirmations=respond.body.result.confirmations;
    await withdrawals[i].save();
    const item=[];
    item.push(withdrawals[i].txid);
    item.push(withdrawals[i].amount);
    item.push(withdrawals[i].address);
    item.push(withdrawals[i].confirmations);
    item.push(withdrawals[i].createdAt);
    data.push(item);
  }
  return res.status(200).json(data);
};

exports.getRechargeList = async (req, res, next) => {
  const page = req.params.page;
  const data=[];
  const recharges = await Recharge.find({ user: req.user.id});
  for (recharge of recharges) {
    const respond = await getTransaction(recharge.txid);
    recharge.confirmations = respond.body.result.confirmations;
    await recharge.save();
    const item=[];
    item.push(recharge.txid);
    item.push(recharge.amount);
    item.push(recharge.confirmations);
    item.push(recharge.createdAt);
    data.push(item);
  }
  return res.status(200).json(data);
};

exports.getBalance = async (req, res, next) => {
  var user = await User.findById(req.user.id);

  return res.status(200).json({ balance: user ? user.doge : 0 });
};

exports.putBalance = async (req, res, next) => {
  var user = await User.findById(req.params.user);
  user.doge=req.body.doge;
  await user.save();
  return res.status(200).json({ balance: user ? user.doge : 0 });
};

