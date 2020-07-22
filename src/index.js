const express = require('express')
var superagent = require('superagent')
const bodyParser = require('body-parser')
const keys = require('./config/keys')

const app = express()

app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}))

var mailchimpInstance = keys.mailchimpInstance,
	listUniqueId = keys.listUniqueId,
	mailchimpApiKey = keys.mailchimpApiKey

app.post('/signup', function (req, res) {
	superagent
		.post(
			`https://${mailchimpInstance}.api.mailchimp.com/3.0/lists/${listUniqueId}/members/`,
		)
		.set('Content-Type', 'application/json;charset=utf-8')
		.set(
			'Authorization',
			'Basic ' + Buffer.from(`any:${mailchimpApiKey}`).toString('base64'),
		)
		.send({
			email_address: req.body.email,
			status: 'subscribed',
			merge_fields: {
				FNAME: req.body.firstName,
				LNAME: req.body.lastName,
			},
		})
		.end(function (err, response) {
			if (response.status < 300) {
				res.send({message: 'Signed Up!'})
			} else if (
				response.status === 400 &&
				response.body.title === 'Member Exists'
			) {
				res.send({message: 'Member Exists!'})
			} else {
				res.send({message: 'Sign Up Failed!'})
			}
		})
})

app.get('/', (req, res) => {
	console.log('hey from get')
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
	console.log('Server started')
})
