import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: +process.env.SMTP_PORT,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

const emailSender = async (obj) => {
    try {
        const info = await transporter.sendMail(obj)
        console.log("Message sent: %s", info.messageId)
    } catch (error) {
        console.log(error)
    }
}

export const sendEmailVerificationLinkEmail = ({ email, fName, url }) => {
    const body =
    {
        from: `"Fashon 👻" <${process.env.SMTP_USER}>`, // sender address
        to: email, // list of receivers
        subject: "Follow the instruction to verify your account", // Subject line
        text: `Hello ${fName}, please follow the link to verify your account ${url} \n\n Regards, Fashon`, // plain text body
        html: `<p>Hello ${fName}</p>
        <br /><br />
        
        <p>Thank you for creating account with us. Click the Button to verify your account.</p>
        <p>
        if the above button doesnt work, copy paste the following
            <a href="${url}">
                <button style="background: green; padding: 2rem; color: white; font-weight: bolder">Verify</button>
            </a>
        </p>
        <br /><br /><br />
        ------------------
        <p>
            Regards,
            <br />
            Fashon
            <br />
            www.fashon.com
        </p>`, // html body
    }
    emailSender(body);
}

export const sendEmailVerifiedNotification = ( {email, fName }) => {
    const body = 
    {
        from: `"Fashon 👻" <${process.env.SMTP_USER}>`, // sender address
        to: email, 
        subject: "Account Verified", // Subject line
        text: `Hello ${fName}, Your account has been verified`,
        html: `<p>Hello ${fName}</p>
        <br /><br />
        
        <p>Thank you for verifing your account. You can login now.</p>
        
        <br /><br /><br />
        ------------------
        <p>
            Regards,
            <br />
            Fashon
            <br />
            www.fashon.com
        </p>`, 
    }
    emailSender(body)
}

export const sendOptEmail = ({ email, fName, otp }) => {
    const body = 
    {
        from: `"Fashon 👻" <${process.env.SMTP_USER}>`, // sender address
        to: email, 
        subject: "Your OTP for password reset", // Subject line
        text: `Hello ${fName}, Here is your OTP ${otp} \n\n Regards, Fashion`,
        html: `<p>Hello ${fName}</p>
        <br /><br />
        
        <p>Here is the OTP you requested.</p>
        <p style="font-size: 3rem; color: red;">${otp}.</p>
        
        <br /><br /><br />
        ------------------
        <p>
            Regards,
            <br />
            Fashon
            <br />
            www.fashon.com
        </p>`, 
    }

    emailSender(body)
}

export const passwordUpdateNotification = ({ email, fName }) => {
    const body = 
    {
        from: `"Fashon 👻" <${process.env.SMTP_USER}>`, // sender address
        to: email, 
        subject: "Your password has been updated", // Subject line
        text: `Hello ${fName}, Your password has been updated. If this wasnt you please contact us or change the password asasp \n\n Regards, Fashon`,
        html: `<p>Hello ${fName}</p>
        <br /><br />
        
        <p>Your password has been updated. If this wasnt you please contact us or change the password asasp.</p>
        
        <br /><br /><br />
        ------------------
        <p>
            Regards,
            <br />
            Fashon
            <br />
            www.fashon.com
        </p>`, 
    }

    emailSender(body)
}