module.exports = {
	'POST /auth/getToken/test': (req, res) => {
		const { password, userName } = req.body;
		// if (userName === 'administrator' && password === '32D05F39C3A370601EE51B1884C60251') {
		return res.send({
			code: 10000,
			msg: 'success',
			result: { token: '########################' },
		});
		// } else {//code, msg, result
		// return res.send({ 'code': 20002, 'msg': 'UserNotExist', 'result': {} });
		// }
	},
};
