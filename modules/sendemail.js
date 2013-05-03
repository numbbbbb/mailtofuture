var nodemailer = require("nodemailer");

var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
        user: "lj925184928@gmail.com",
        pass: "lovdpxgyraubwprp"
    }
});

// setup e-mail data with unicode symbols


module.exports = smtpTransport;