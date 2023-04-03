const nodeMailer = require('../config/nodemailer');


// this is another way of exporting a method
exports.newOrderplaced = (placeorderData) => {
    nodeMailer.transporter.sendMail({
       from: process.env.USERMAIL,
       to: placeorderData.email,
       subject: "Order Placed!",
       html: `
       <center>
           <table  style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; letter-spacing: 1px; line-height: 25px;">
               <thead>
                   <tr>
                       <th colspan="2" style="padding: 15px;">
                           <img src="https://cdn.dribbble.com/users/282075/screenshots/4756095/icon_confirmation.gif" alt="" height="260px" width="350px">
                           <h3 style="color: rgb(27, 202, 27); ">Yup!  your order is placed successfully</h3>
                       </th>
                   </tr>
               </thead>
               <tbody>
                   <tr >
                       <td style="padding: 15px; color: lightslategray; font-weight: bold; border-bottom: 1px solid;">Order Details:</td>
                       <td style="font-size: small; padding: 15px; border-bottom: 1px solid lightslategray;">orderId: ${placeorderData.id} <br> hotel name: ${placeorderData.hotel_name} </td>
                   </tr>
                  
                   <tr >
                       <td style="padding: 15px; color: lightslategray; font-weight: bold; border-bottom: 1px solid;">Billing Details:</td>
                       <td style="font-size: small; padding: 15px; border-bottom: 1px solid lightslategray;">orderId: ${placeorderData.id} <br> name: ${placeorderData.name} <br> email: ${placeorderData.email} <br>  phone: ${placeorderData.phone} <br> cost: ${placeorderData.cost} </td>
                   </tr>
                   <tr>
                       <td style="padding: 15px; color: lightslategray; font-weight: bold;  border-bottom: 1px solid;">Delivery Address:</td>
                       <td style="font-size: small; padding: 15px; border-bottom: 1px solid lightslategray;">name: ${placeorderData.name} <br> email: ${placeorderData.email} <br>  phone: ${placeorderData.phone} <br> cost: ${placeorderData.cost} <br> address:${placeorderData.address}</td>
                   </tr>
                   <tr>
                       <td style="padding: 15px; color: lightslategray; font-weight: bold;">Total order cost:</td>
                       <td style="padding: 15px;"> Rs: ${placeorderData.cost} </td>
                   </tr>
               </tbody>
           </table>
       </center>
       `
    }, (err, info) => {
        if (err){
            console.log('Error in sending mail', err);
            return;
        }

        console.log('Message sent');
        return;
    });
}
