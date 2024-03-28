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
        from: `"BGS 👻" <${process.env.SMTP_USER}>`, // sender address
        to: email, // list of receivers
        subject: "Follow the instruction to verify your account", // Subject line
        text: `Hello ${fName}, please follow the link to verify your account ${url} \n\n Regards, BGS`, // plain text body
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
            BGS
            <br />
            www.bgs.com
        </p>`, // html body
    }
    emailSender(body);
}

export const sendEmailVerifiedNotification = ({ email, fName }) => {
    const body =
    {
        from: `"BGS 👻" <${process.env.SMTP_USER}>`, // sender address
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
            BGS
            <br />
            www.bgs.com
        </p>`,
    }
    emailSender(body)
}

export const sendOptEmail = ({ email, fName, otp }) => {
    const body =
    {
        from: `"BGS 👻" <${process.env.SMTP_USER}>`, // sender address
        to: email,
        subject: "Your OTP for password reset", // Subject line
        text: `Hello ${fName}, Here is your OTP ${otp} \n\n Regards, BGS`,
        html: `<p>Hello ${fName}</p>
        <br /><br />
        
        <p>Here is the OTP you requested.</p>
        <p style="font-size: 3rem; color: red;">${otp}.</p>
        
        <br /><br /><br />
        ------------------
        <p>
            Regards,
            <br />
            BGS
            <br />
            www.bgs.com
        </p>`,
    }

    emailSender(body)
}

export const passwordUpdateNotification = ({ email, fName }) => {
    const body =
    {
        from: `"BGS 👻" <${process.env.SMTP_USER}>`, // sender address
        to: email,
        subject: "Your password has been updated", // Subject line
        text: `Hello ${fName}, Your password has been updated. If this wasnt you please contact us or change the password asasp \n\n Regards, BGS`,
        html: `<p>Hello ${fName}</p>
        <br /><br />
        
        <p>Your password has been updated. If this wasnt you please contact us or change the password asasp.</p>
        
        <br /><br /><br />
        ------------------
        <p>
            Regards,
            <br />
            BGS
            <br />
            www.bgs.com
        </p>`,
    }

    emailSender(body)
}

export const sendEmailReceipt = ({ email, fName, cartItem, subTotal, shippingEstimate, taxEstimate, orderTotal }) => {
    
    const body =
    {
        from: `"BGS 👻" <${process.env.SMTP_USER}>`, // sender address
        to: email, // list of receivers
        subject: "Receipt Of Your Order", // Subject line
        text: `Hello ${fName}, Here is your Order detail and payment receipt \n\n Regards, BGS`, // plain text body
        html: `<p>Hello ${fName}</p>
        <br /><br />
        
        <p>Here is your Order detail and payment receipt</p>
        <table style="border-collapse; width: 100%;">
            <thead>
                <tr>
                    <th style="border: 1px solid #ddd; padding: 8px;">#</th>
                    <th style="border: 1px solid #ddd; padding: 8px;">Product</th>
                    <th style="border: 1px solid #ddd; padding: 8px;">Name</th>
                    <th style="border: 1px solid #ddd; padding: 8px;">Qty</th>
                    <th style="border: 1px solid #ddd; padding: 8px;">Price</th>
                    <th style="border: 1px solid #ddd; padding: 8px;">Total Price</th>
                </tr>
            </thead>
            <tbody>
                ${cartItem.map(({ name, price, qty, thumbnail }, i) => `
                    <tr key=${i}>
                        <td>${i + 1}</td>
                        <td><img width="100px" src=${thumbnail}></td>
                        <td>${name}</td>
                        <td>${qty}</td>
                        <td>$${price}</td>
                        <td>$${price * qty}</td>
                    </tr>`).join('')
                }
            </tbody>
        </table>
        <br /><br />
        <p>Sub-Total: $${subTotal} </p>
        <p>Shipping: $${shippingEstimate} </p>
        <p>Tax Estimate: $${taxEstimate} </p>
        <p>Order Price: $${orderTotal} </p>
        <br /><br /><br />
        ------------------
        <p>
            Regards,
            <br />
            BGS
            <br />
            www.bgs.com
        </p>`, // html body
    }
    emailSender(body);
}