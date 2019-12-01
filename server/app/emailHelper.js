const nodemailer = require('nodemailer');
var format = require("string-template");
const modelWrappers = require('../models/modelWrappers.js');
const strftime = require('strftime');

module.exports = {};

const STRFTIME_FORMAT_STRING = "%A %B %e, %Y at %l:%M %p";

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MODERATOR_EMAIL_USER,
    pass: process.env.MODERATOR_EMAIL_PASS
  }
});

module.exports.sendEmail = function (session, email, url) {
  modelWrappers.SessionInfo.get(session).then(function(data) {

    let mailOptions = {
      from: process.env.MODERATOR_EMAIL_USER,
      to: email,
      subject: '[Election] ' + data.title,
      html: format(HTML, {
        title: data.title,
        description: data.description,
        time: strftime(STRFTIME_FORMAT_STRING, data.time) + " EST",
        url: process.env.URL_BASE + url
      }),
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

  });
};


let HTML = "<!doctype html>\n" +
  "<html xmlns=\"http://www.w3.org/1999/xhtml\" xmlns:v=\"urn:schemas-microsoft-com:vml\" xmlns:o=\"urn:schemas-microsoft-com:office:office\">\n" +
  "\t<head>\n" +
  "\t\t<!-- NAME: GDPR SUBSCRIBER ALERT -->\n" +
  "\t\t<!--[if gte mso 15]>\n" +
  "\t\t<xml>\n" +
  "\t\t\t<o:OfficeDocumentSettings>\n" +
  "\t\t\t<o:AllowPNG/>\n" +
  "\t\t\t<o:PixelsPerInch>96</o:PixelsPerInch>\n" +
  "\t\t\t</o:OfficeDocumentSettings>\n" +
  "\t\t</xml>\n" +
  "\t\t<![endif]-->\n" +
  "\t\t<meta charset=\"UTF-8\">\n" +
  "        <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\n" +
  "        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n" +
  "\t\t<title>*|MC:SUBJECT|*</title>\n" +
  "        \n" +
  "    <style type=\"text/css\">\n" +
  "\t\tp{\n" +
  "\t\t\tmargin:10px 0;\n" +
  "\t\t\tpadding:0;\n" +
  "\t\t}\n" +
  "\t\ttable{\n" +
  "\t\t\tborder-collapse:collapse;\n" +
  "\t\t}\n" +
  "\t\th1,h2,h3,h4,h5,h6{\n" +
  "\t\t\tdisplay:block;\n" +
  "\t\t\tmargin:0;\n" +
  "\t\t\tpadding:0;\n" +
  "\t\t}\n" +
  "\t\timg,a img{\n" +
  "\t\t\tborder:0;\n" +
  "\t\t\theight:auto;\n" +
  "\t\t\toutline:none;\n" +
  "\t\t\ttext-decoration:none;\n" +
  "\t\t}\n" +
  "\t\tbody,#bodyTable,#bodyCell{\n" +
  "\t\t\theight:100%;\n" +
  "\t\t\tmargin:0;\n" +
  "\t\t\tpadding:0;\n" +
  "\t\t\twidth:100%;\n" +
  "\t\t}\n" +
  "\t\t.mcnPreviewText{\n" +
  "\t\t\tdisplay:none !important;\n" +
  "\t\t}\n" +
  "\t\t#outlook a{\n" +
  "\t\t\tpadding:0;\n" +
  "\t\t}\n" +
  "\t\timg{\n" +
  "\t\t\t-ms-interpolation-mode:bicubic;\n" +
  "\t\t}\n" +
  "\t\ttable{\n" +
  "\t\t\tmso-table-lspace:0pt;\n" +
  "\t\t\tmso-table-rspace:0pt;\n" +
  "\t\t}\n" +
  "\t\t.ReadMsgBody{\n" +
  "\t\t\twidth:100%;\n" +
  "\t\t}\n" +
  "\t\t.ExternalClass{\n" +
  "\t\t\twidth:100%;\n" +
  "\t\t}\n" +
  "\t\tp,a,li,td,blockquote{\n" +
  "\t\t\tmso-line-height-rule:exactly;\n" +
  "\t\t}\n" +
  "\t\ta[href^=tel],a[href^=sms]{\n" +
  "\t\t\tcolor:inherit;\n" +
  "\t\t\tcursor:default;\n" +
  "\t\t\ttext-decoration:none;\n" +
  "\t\t}\n" +
  "\t\tp,a,li,td,body,table,blockquote{\n" +
  "\t\t\t-ms-text-size-adjust:100%;\n" +
  "\t\t\t-webkit-text-size-adjust:100%;\n" +
  "\t\t}\n" +
  "\t\t.ExternalClass,.ExternalClass p,.ExternalClass td,.ExternalClass div,.ExternalClass span,.ExternalClass font{\n" +
  "\t\t\tline-height:100%;\n" +
  "\t\t}\n" +
  "\t\ta[x-apple-data-detectors]{\n" +
  "\t\t\tcolor:inherit !important;\n" +
  "\t\t\ttext-decoration:none !important;\n" +
  "\t\t\tfont-size:inherit !important;\n" +
  "\t\t\tfont-family:inherit !important;\n" +
  "\t\t\tfont-weight:inherit !important;\n" +
  "\t\t\tline-height:inherit !important;\n" +
  "\t\t}\n" +
  "\t\t.templateContainer{\n" +
  "\t\t\tmax-width:600px !important;\n" +
  "\t\t}\n" +
  "\t\ta.mcnButton{\n" +
  "\t\t\tdisplay:block;\n" +
  "\t\t}\n" +
  "\t\t.mcnImage,.mcnRetinaImage{\n" +
  "\t\t\tvertical-align:bottom;\n" +
  "\t\t}\n" +
  "\t\t.mcnTextContent{\n" +
  "\t\t\tword-break:break-word;\n" +
  "\t\t}\n" +
  "\t\t.mcnTextContent img{\n" +
  "\t\t\theight:auto !important;\n" +
  "\t\t}\n" +
  "\t\t.mcnDividerBlock{\n" +
  "\t\t\ttable-layout:fixed !important;\n" +
  "\t\t}\n" +
  "\t/*\n" +
  "\t@tab Page\n" +
  "\t@section Heading 1\n" +
  "\t@style heading 1\n" +
  "\t*/\n" +
  "\t\th1{\n" +
  "\t\t\t/*@editable*/color:#222222;\n" +
  "\t\t\t/*@editable*/font-family:Helvetica;\n" +
  "\t\t\t/*@editable*/font-size:40px;\n" +
  "\t\t\t/*@editable*/font-style:normal;\n" +
  "\t\t\t/*@editable*/font-weight:bold;\n" +
  "\t\t\t/*@editable*/line-height:150%;\n" +
  "\t\t\t/*@editable*/letter-spacing:normal;\n" +
  "\t\t\t/*@editable*/text-align:center;\n" +
  "\t\t}\n" +
  "\t/*\n" +
  "\t@tab Page\n" +
  "\t@section Heading 2\n" +
  "\t@style heading 2\n" +
  "\t*/\n" +
  "\t\th2{\n" +
  "\t\t\t/*@editable*/color:#222222;\n" +
  "\t\t\t/*@editable*/font-family:Helvetica;\n" +
  "\t\t\t/*@editable*/font-size:34px;\n" +
  "\t\t\t/*@editable*/font-style:normal;\n" +
  "\t\t\t/*@editable*/font-weight:bold;\n" +
  "\t\t\t/*@editable*/line-height:150%;\n" +
  "\t\t\t/*@editable*/letter-spacing:normal;\n" +
  "\t\t\t/*@editable*/text-align:left;\n" +
  "\t\t}\n" +
  "\t/*\n" +
  "\t@tab Page\n" +
  "\t@section Heading 3\n" +
  "\t@style heading 3\n" +
  "\t*/\n" +
  "\t\th3{\n" +
  "\t\t\t/*@editable*/color:#444444;\n" +
  "\t\t\t/*@editable*/font-family:Helvetica;\n" +
  "\t\t\t/*@editable*/font-size:22px;\n" +
  "\t\t\t/*@editable*/font-style:normal;\n" +
  "\t\t\t/*@editable*/font-weight:bold;\n" +
  "\t\t\t/*@editable*/line-height:150%;\n" +
  "\t\t\t/*@editable*/letter-spacing:normal;\n" +
  "\t\t\t/*@editable*/text-align:left;\n" +
  "\t\t}\n" +
  "\t/*\n" +
  "\t@tab Page\n" +
  "\t@section Heading 4\n" +
  "\t@style heading 4\n" +
  "\t*/\n" +
  "\t\th4{\n" +
  "\t\t\t/*@editable*/color:#999999;\n" +
  "\t\t\t/*@editable*/font-family:Georgia;\n" +
  "\t\t\t/*@editable*/font-size:20px;\n" +
  "\t\t\t/*@editable*/font-style:italic;\n" +
  "\t\t\t/*@editable*/font-weight:normal;\n" +
  "\t\t\t/*@editable*/line-height:125%;\n" +
  "\t\t\t/*@editable*/letter-spacing:normal;\n" +
  "\t\t\t/*@editable*/text-align:left;\n" +
  "\t\t}\n" +
  "\t/*\n" +
  "\t@tab Header\n" +
  "\t@section Header Container Style\n" +
  "\t*/\n" +
  "\t\t#templateHeader{\n" +
  "\t\t\t/*@editable*/background-color:#F2F2F2;\n" +
  "\t\t\t/*@editable*/background-image:none;\n" +
  "\t\t\t/*@editable*/background-repeat:no-repeat;\n" +
  "\t\t\t/*@editable*/background-position:center;\n" +
  "\t\t\t/*@editable*/background-size:cover;\n" +
  "\t\t\t/*@editable*/border-top:0;\n" +
  "\t\t\t/*@editable*/border-bottom:0;\n" +
  "\t\t\t/*@editable*/padding-top:36px;\n" +
  "\t\t\t/*@editable*/padding-bottom:0;\n" +
  "\t\t}\n" +
  "\t/*\n" +
  "\t@tab Header\n" +
  "\t@section Header Interior Style\n" +
  "\t*/\n" +
  "\t\t.headerContainer{\n" +
  "\t\t\t/*@editable*/background-color:#FFFFFF;\n" +
  "\t\t\t/*@editable*/background-image:none;\n" +
  "\t\t\t/*@editable*/background-repeat:no-repeat;\n" +
  "\t\t\t/*@editable*/background-position:center;\n" +
  "\t\t\t/*@editable*/background-size:cover;\n" +
  "\t\t\t/*@editable*/border-top:0;\n" +
  "\t\t\t/*@editable*/border-bottom:0;\n" +
  "\t\t\t/*@editable*/padding-top:45px;\n" +
  "\t\t\t/*@editable*/padding-bottom:45px;\n" +
  "\t\t}\n" +
  "\t/*\n" +
  "\t@tab Header\n" +
  "\t@section Header Text\n" +
  "\t*/\n" +
  "\t\t.headerContainer .mcnTextContent,.headerContainer .mcnTextContent p{\n" +
  "\t\t\t/*@editable*/color:#808080;\n" +
  "\t\t\t/*@editable*/font-family:Helvetica;\n" +
  "\t\t\t/*@editable*/font-size:16px;\n" +
  "\t\t\t/*@editable*/line-height:150%;\n" +
  "\t\t\t/*@editable*/text-align:left;\n" +
  "\t\t}\n" +
  "\t/*\n" +
  "\t@tab Header\n" +
  "\t@section Header Link\n" +
  "\t*/\n" +
  "\t\t.headerContainer .mcnTextContent a,.headerContainer .mcnTextContent p a{\n" +
  "\t\t\t/*@editable*/color:#007E9E;\n" +
  "\t\t\t/*@editable*/font-weight:normal;\n" +
  "\t\t\t/*@editable*/text-decoration:underline;\n" +
  "\t\t}\n" +
  "\t/*\n" +
  "\t@tab Body\n" +
  "\t@section Body Container Style\n" +
  "\t*/\n" +
  "\t\t#templateBody{\n" +
  "\t\t\t/*@editable*/background-color:#F2F2F2;\n" +
  "\t\t\t/*@editable*/background-image:none;\n" +
  "\t\t\t/*@editable*/background-repeat:no-repeat;\n" +
  "\t\t\t/*@editable*/background-position:center;\n" +
  "\t\t\t/*@editable*/background-size:cover;\n" +
  "\t\t\t/*@editable*/border-top:0;\n" +
  "\t\t\t/*@editable*/border-bottom:0;\n" +
  "\t\t\t/*@editable*/padding-top:0;\n" +
  "\t\t\t/*@editable*/padding-bottom:0;\n" +
  "\t\t}\n" +
  "\t/*\n" +
  "\t@tab Body\n" +
  "\t@section Body Interior Style\n" +
  "\t*/\n" +
  "\t\t.bodyContainer{\n" +
  "\t\t\t/*@editable*/background-color:#FFFFFF;\n" +
  "\t\t\t/*@editable*/background-image:none;\n" +
  "\t\t\t/*@editable*/background-repeat:no-repeat;\n" +
  "\t\t\t/*@editable*/background-position:center;\n" +
  "\t\t\t/*@editable*/background-size:cover;\n" +
  "\t\t\t/*@editable*/border-top:0;\n" +
  "\t\t\t/*@editable*/border-bottom:0;\n" +
  "\t\t\t/*@editable*/padding-top:0;\n" +
  "\t\t\t/*@editable*/padding-bottom:45px;\n" +
  "\t\t}\n" +
  "\t/*\n" +
  "\t@tab Body\n" +
  "\t@section Body Text\n" +
  "\t*/\n" +
  "\t\t.bodyContainer .mcnTextContent,.bodyContainer .mcnTextContent p{\n" +
  "\t\t\t/*@editable*/color:#808080;\n" +
  "\t\t\t/*@editable*/font-family:Helvetica;\n" +
  "\t\t\t/*@editable*/font-size:16px;\n" +
  "\t\t\t/*@editable*/line-height:150%;\n" +
  "\t\t\t/*@editable*/text-align:left;\n" +
  "\t\t}\n" +
  "\t/*\n" +
  "\t@tab Body\n" +
  "\t@section Body Link\n" +
  "\t*/\n" +
  "\t\t.bodyContainer .mcnTextContent a,.bodyContainer .mcnTextContent p a{\n" +
  "\t\t\t/*@editable*/color:#007E9E;\n" +
  "\t\t\t/*@editable*/font-weight:normal;\n" +
  "\t\t\t/*@editable*/text-decoration:underline;\n" +
  "\t\t}\n" +
  "\t/*\n" +
  "\t@tab Footer\n" +
  "\t@section Footer Style\n" +
  "\t*/\n" +
  "\t\t#templateFooter{\n" +
  "\t\t\t/*@editable*/background-color:#F2F2F2;\n" +
  "\t\t\t/*@editable*/background-image:none;\n" +
  "\t\t\t/*@editable*/background-repeat:no-repeat;\n" +
  "\t\t\t/*@editable*/background-position:center;\n" +
  "\t\t\t/*@editable*/background-size:cover;\n" +
  "\t\t\t/*@editable*/border-top:0;\n" +
  "\t\t\t/*@editable*/border-bottom:0;\n" +
  "\t\t\t/*@editable*/padding-top:0;\n" +
  "\t\t\t/*@editable*/padding-bottom:36px;\n" +
  "\t\t}\n" +
  "\t/*\n" +
  "\t@tab Footer\n" +
  "\t@section Footer Interior Style\n" +
  "\t*/\n" +
  "\t\t.footerContainer{\n" +
  "\t\t\t/*@editable*/background-color:#333333;\n" +
  "\t\t\t/*@editable*/background-image:none;\n" +
  "\t\t\t/*@editable*/background-repeat:no-repeat;\n" +
  "\t\t\t/*@editable*/background-position:center;\n" +
  "\t\t\t/*@editable*/background-size:cover;\n" +
  "\t\t\t/*@editable*/border-top:0;\n" +
  "\t\t\t/*@editable*/border-bottom:0;\n" +
  "\t\t\t/*@editable*/padding-top:45px;\n" +
  "\t\t\t/*@editable*/padding-bottom:45px;\n" +
  "\t\t}\n" +
  "\t/*\n" +
  "\t@tab Footer\n" +
  "\t@section Footer Text\n" +
  "\t*/\n" +
  "\t\t.footerContainer .mcnTextContent,.footerContainer .mcnTextContent p{\n" +
  "\t\t\t/*@editable*/color:#FFFFFF;\n" +
  "\t\t\t/*@editable*/font-family:Helvetica;\n" +
  "\t\t\t/*@editable*/font-size:12px;\n" +
  "\t\t\t/*@editable*/line-height:150%;\n" +
  "\t\t\t/*@editable*/text-align:center;\n" +
  "\t\t}\n" +
  "\t/*\n" +
  "\t@tab Footer\n" +
  "\t@section Footer Link\n" +
  "\t*/\n" +
  "\t\t.footerContainer .mcnTextContent a,.footerContainer .mcnTextContent p a{\n" +
  "\t\t\t/*@editable*/color:#FFFFFF;\n" +
  "\t\t\t/*@editable*/font-weight:normal;\n" +
  "\t\t\t/*@editable*/text-decoration:underline;\n" +
  "\t\t}\n" +
  "\t@media only screen and (min-width:768px){\n" +
  "\t\t.templateContainer{\n" +
  "\t\t\twidth:600px !important;\n" +
  "\t\t}\n" +
  "\n" +
  "}\t@media only screen and (max-width: 480px){\n" +
  "\t\tbody,table,td,p,a,li,blockquote{\n" +
  "\t\t\t-webkit-text-size-adjust:none !important;\n" +
  "\t\t}\n" +
  "\n" +
  "}\t@media only screen and (max-width: 480px){\n" +
  "\t\tbody{\n" +
  "\t\t\twidth:100% !important;\n" +
  "\t\t\tmin-width:100% !important;\n" +
  "\t\t}\n" +
  "\n" +
  "}\t@media only screen and (max-width: 480px){\n" +
  "\t\t.mcnRetinaImage{\n" +
  "\t\t\tmax-width:100% !important;\n" +
  "\t\t}\n" +
  "\n" +
  "}\t@media only screen and (max-width: 480px){\n" +
  "\t\t.mcnImage{\n" +
  "\t\t\twidth:100% !important;\n" +
  "\t\t}\n" +
  "\n" +
  "}\t@media only screen and (max-width: 480px){\n" +
  "\t\t.mcnCartContainer,.mcnCaptionTopContent,.mcnRecContentContainer,.mcnCaptionBottomContent,.mcnTextContentContainer,.mcnBoxedTextContentContainer,.mcnImageGroupContentContainer,.mcnCaptionLeftTextContentContainer,.mcnCaptionRightTextContentContainer,.mcnCaptionLeftImageContentContainer,.mcnCaptionRightImageContentContainer,.mcnImageCardLeftTextContentContainer,.mcnImageCardRightTextContentContainer,.mcnImageCardLeftImageContentContainer,.mcnImageCardRightImageContentContainer{\n" +
  "\t\t\tmax-width:100% !important;\n" +
  "\t\t\twidth:100% !important;\n" +
  "\t\t}\n" +
  "\n" +
  "}\t@media only screen and (max-width: 480px){\n" +
  "\t\t.mcnBoxedTextContentContainer{\n" +
  "\t\t\tmin-width:100% !important;\n" +
  "\t\t}\n" +
  "\n" +
  "}\t@media only screen and (max-width: 480px){\n" +
  "\t\t.mcnImageGroupContent{\n" +
  "\t\t\tpadding:9px !important;\n" +
  "\t\t}\n" +
  "\n" +
  "}\t@media only screen and (max-width: 480px){\n" +
  "\t\t.mcnCaptionLeftContentOuter .mcnTextContent,.mcnCaptionRightContentOuter .mcnTextContent{\n" +
  "\t\t\tpadding-top:9px !important;\n" +
  "\t\t}\n" +
  "\n" +
  "}\t@media only screen and (max-width: 480px){\n" +
  "\t\t.mcnImageCardTopImageContent,.mcnCaptionBottomContent:last-child .mcnCaptionBottomImageContent,.mcnCaptionBlockInner .mcnCaptionTopContent:last-child .mcnTextContent{\n" +
  "\t\t\tpadding-top:18px !important;\n" +
  "\t\t}\n" +
  "\n" +
  "}\t@media only screen and (max-width: 480px){\n" +
  "\t\t.mcnImageCardBottomImageContent{\n" +
  "\t\t\tpadding-bottom:9px !important;\n" +
  "\t\t}\n" +
  "\n" +
  "}\t@media only screen and (max-width: 480px){\n" +
  "\t\t.mcnImageGroupBlockInner{\n" +
  "\t\t\tpadding-top:0 !important;\n" +
  "\t\t\tpadding-bottom:0 !important;\n" +
  "\t\t}\n" +
  "\n" +
  "}\t@media only screen and (max-width: 480px){\n" +
  "\t\t.mcnImageGroupBlockOuter{\n" +
  "\t\t\tpadding-top:9px !important;\n" +
  "\t\t\tpadding-bottom:9px !important;\n" +
  "\t\t}\n" +
  "\n" +
  "}\t@media only screen and (max-width: 480px){\n" +
  "\t\t.mcnTextContent,.mcnBoxedTextContentColumn{\n" +
  "\t\t\tpadding-right:18px !important;\n" +
  "\t\t\tpadding-left:18px !important;\n" +
  "\t\t}\n" +
  "\n" +
  "}\t@media only screen and (max-width: 480px){\n" +
  "\t\t.mcnImageCardLeftImageContent,.mcnImageCardRightImageContent{\n" +
  "\t\t\tpadding-right:18px !important;\n" +
  "\t\t\tpadding-bottom:0 !important;\n" +
  "\t\t\tpadding-left:18px !important;\n" +
  "\t\t}\n" +
  "\n" +
  "}\t@media only screen and (max-width: 480px){\n" +
  "\t\t.mcpreview-image-uploader{\n" +
  "\t\t\tdisplay:none !important;\n" +
  "\t\t\twidth:100% !important;\n" +
  "\t\t}\n" +
  "\n" +
  "}\t@media only screen and (max-width: 480px){\n" +
  "\t/*\n" +
  "\t@tab Mobile Styles\n" +
  "\t@section Heading 1\n" +
  "\t@tip Make the first-level headings larger in size for better readability on small screens.\n" +
  "\t*/\n" +
  "\t\th1{\n" +
  "\t\t\t/*@editable*/font-size:30px !important;\n" +
  "\t\t\t/*@editable*/line-height:125% !important;\n" +
  "\t\t}\n" +
  "\n" +
  "}\t@media only screen and (max-width: 480px){\n" +
  "\t/*\n" +
  "\t@tab Mobile Styles\n" +
  "\t@section Heading 2\n" +
  "\t@tip Make the second-level headings larger in size for better readability on small screens.\n" +
  "\t*/\n" +
  "\t\th2{\n" +
  "\t\t\t/*@editable*/font-size:26px !important;\n" +
  "\t\t\t/*@editable*/line-height:125% !important;\n" +
  "\t\t}\n" +
  "\n" +
  "}\t@media only screen and (max-width: 480px){\n" +
  "\t/*\n" +
  "\t@tab Mobile Styles\n" +
  "\t@section Heading 3\n" +
  "\t@tip Make the third-level headings larger in size for better readability on small screens.\n" +
  "\t*/\n" +
  "\t\th3{\n" +
  "\t\t\t/*@editable*/font-size:20px !important;\n" +
  "\t\t\t/*@editable*/line-height:150% !important;\n" +
  "\t\t}\n" +
  "\n" +
  "}\t@media only screen and (max-width: 480px){\n" +
  "\t/*\n" +
  "\t@tab Mobile Styles\n" +
  "\t@section Heading 4\n" +
  "\t@tip Make the fourth-level headings larger in size for better readability on small screens.\n" +
  "\t*/\n" +
  "\t\th4{\n" +
  "\t\t\t/*@editable*/font-size:18px !important;\n" +
  "\t\t\t/*@editable*/line-height:150% !important;\n" +
  "\t\t}\n" +
  "\n" +
  "}\t@media only screen and (max-width: 480px){\n" +
  "\t/*\n" +
  "\t@tab Mobile Styles\n" +
  "\t@section Boxed Text\n" +
  "\t@tip Make the boxed text larger in size for better readability on small screens. We recommend a font size of at least 16px.\n" +
  "\t*/\n" +
  "\t\t.mcnBoxedTextContentContainer .mcnTextContent,.mcnBoxedTextContentContainer .mcnTextContent p{\n" +
  "\t\t\t/*@editable*/font-size:14px !important;\n" +
  "\t\t\t/*@editable*/line-height:150% !important;\n" +
  "\t\t}\n" +
  "\n" +
  "}\t@media only screen and (max-width: 480px){\n" +
  "\t/*\n" +
  "\t@tab Mobile Styles\n" +
  "\t@section Header Text\n" +
  "\t@tip Make the header text larger in size for better readability on small screens.\n" +
  "\t*/\n" +
  "\t\t.headerContainer .mcnTextContent,.headerContainer .mcnTextContent p{\n" +
  "\t\t\t/*@editable*/font-size:16px !important;\n" +
  "\t\t\t/*@editable*/line-height:150% !important;\n" +
  "\t\t}\n" +
  "\n" +
  "}\t@media only screen and (max-width: 480px){\n" +
  "\t/*\n" +
  "\t@tab Mobile Styles\n" +
  "\t@section Body Text\n" +
  "\t@tip Make the body text larger in size for better readability on small screens. We recommend a font size of at least 16px.\n" +
  "\t*/\n" +
  "\t\t.bodyContainer .mcnTextContent,.bodyContainer .mcnTextContent p{\n" +
  "\t\t\t/*@editable*/font-size:16px !important;\n" +
  "\t\t\t/*@editable*/line-height:150% !important;\n" +
  "\t\t}\n" +
  "\n" +
  "}\t@media only screen and (max-width: 480px){\n" +
  "\t/*\n" +
  "\t@tab Mobile Styles\n" +
  "\t@section Footer Text\n" +
  "\t@tip Make the footer content text larger in size for better readability on small screens.\n" +
  "\t*/\n" +
  "\t\t.footerContainer .mcnTextContent,.footerContainer .mcnTextContent p{\n" +
  "\t\t\t/*@editable*/font-size:14px !important;\n" +
  "\t\t\t/*@editable*/line-height:150% !important;\n" +
  "\t\t}\n" +
  "\n" +
  "}</style></head>\n" +
  "    <body>\n" +
  "\t\t<!--*|IF:MC_PREVIEW_TEXT|*-->\n" +
  "\t\t<!--[if !gte mso 9]><!----><span class=\"mcnPreviewText\" style=\"display:none; font-size:0px; line-height:0px; max-height:0px; max-width:0px; opacity:0; overflow:hidden; visibility:hidden; mso-hide:all;\"></span><!--<![endif]-->\n" +
  "\t\t<!--*|END:IF|*-->\n" +
  "        <center>\n" +
  "            <table align=\"center\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\" id=\"bodyTable\">\n" +
  "                <tr>\n" +
  "                    <td align=\"center\" valign=\"top\" id=\"bodyCell\">\n" +
  "                        <!-- BEGIN TEMPLATE // -->\n" +
  "                        <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\">\n" +
  "\t\t\t\t\t\t\t<tr>\n" +
  "\t\t\t\t\t\t\t\t<td align=\"center\" valign=\"top\" id=\"templateHeader\">\n" +
  "\t\t\t\t\t\t\t\t\t<!--[if (gte mso 9)|(IE)]>\n" +
  "\t\t\t\t\t\t\t\t\t<table align=\"center\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" width=\"600\" style=\"width:600px;\">\n" +
  "\t\t\t\t\t\t\t\t\t<tr>\n" +
  "\t\t\t\t\t\t\t\t\t<td align=\"center\" valign=\"top\" width=\"600\" style=\"width:600px;\">\n" +
  "\t\t\t\t\t\t\t\t\t<![endif]-->\n" +
  "\t\t\t\t\t\t\t\t\t<table align=\"center\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" class=\"templateContainer\">\n" +
  "\t\t\t\t\t\t\t\t\t\t<tr>\n" +
  "                                \t\t\t<td valign=\"top\" class=\"headerContainer\"></td>\n" +
  "\t\t\t\t\t\t\t\t\t\t</tr>\n" +
  "\t\t\t\t\t\t\t\t\t</table>\n" +
  "\t\t\t\t\t\t\t\t\t<!--[if (gte mso 9)|(IE)]>\n" +
  "\t\t\t\t\t\t\t\t\t</td>\n" +
  "\t\t\t\t\t\t\t\t\t</tr>\n" +
  "\t\t\t\t\t\t\t\t\t</table>\n" +
  "\t\t\t\t\t\t\t\t\t<![endif]-->\n" +
  "\t\t\t\t\t\t\t\t</td>\n" +
  "                            </tr>\n" +
  "\t\t\t\t\t\t\t<tr>\n" +
  "\t\t\t\t\t\t\t\t<td align=\"center\" valign=\"top\" id=\"templateBody\">\n" +
  "\t\t\t\t\t\t\t\t\t<!--[if (gte mso 9)|(IE)]>\n" +
  "\t\t\t\t\t\t\t\t\t<table align=\"center\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" width=\"600\" style=\"width:600px;\">\n" +
  "\t\t\t\t\t\t\t\t\t<tr>\n" +
  "\t\t\t\t\t\t\t\t\t<td align=\"center\" valign=\"top\" width=\"600\" style=\"width:600px;\">\n" +
  "\t\t\t\t\t\t\t\t\t<![endif]-->\n" +
  "\t\t\t\t\t\t\t\t\t<table align=\"center\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" class=\"templateContainer\">\n" +
  "\t\t\t\t\t\t\t\t\t\t<tr>\n" +
  "                                \t\t\t<td valign=\"top\" class=\"bodyContainer\"><table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" class=\"mcnTextBlock\" style=\"min-width:100%;\">\n" +
  "    <tbody class=\"mcnTextBlockOuter\">\n" +
  "        <tr>\n" +
  "            <td valign=\"top\" class=\"mcnTextBlockInner\" style=\"padding-top:9px;\">\n" +
  "              \t<!--[if mso]>\n" +
  "\t\t\t\t<table align=\"left\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" width=\"100%\" style=\"width:100%;\">\n" +
  "\t\t\t\t<tr>\n" +
  "\t\t\t\t<![endif]-->\n" +
  "\t\t\t    \n" +
  "\t\t\t\t<!--[if mso]>\n" +
  "\t\t\t\t<td valign=\"top\" width=\"600\" style=\"width:600px;\">\n" +
  "\t\t\t\t<![endif]-->\n" +
  "                <table align=\"left\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"max-width:100%; min-width:100%;\" width=\"100%\" class=\"mcnTextContentContainer\">\n" +
  "                    <tbody><tr>\n" +
  "                        \n" +
  "                        <td valign=\"top\" class=\"mcnTextContent\" style=\"padding-top:0; padding-right:18px; padding-bottom:9px; padding-left:18px;\">\n" +
  "                        \n" +
  "                            <h3><strong>{title}</strong></h3>\n" +
  "{description}<br>\n" +
  "<br>\n" +
  "Please cast your vote before {time}.<br>\n" +
  "&nbsp;\n" +
  "                        </td>\n" +
  "                    </tr>\n" +
  "                </tbody></table>\n" +
  "\t\t\t\t<!--[if mso]>\n" +
  "\t\t\t\t</td>\n" +
  "\t\t\t\t<![endif]-->\n" +
  "                \n" +
  "\t\t\t\t<!--[if mso]>\n" +
  "\t\t\t\t</tr>\n" +
  "\t\t\t\t</table>\n" +
  "\t\t\t\t<![endif]-->\n" +
  "            </td>\n" +
  "        </tr>\n" +
  "    </tbody>\n" +
  "</table><table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" class=\"mcnDividerBlock\" style=\"min-width:100%;\">\n" +
  "    <tbody class=\"mcnDividerBlockOuter\">\n" +
  "        <tr>\n" +
  "            <td class=\"mcnDividerBlockInner\" style=\"min-width: 100%; padding: 9px 18px 0px;\">\n" +
  "                <table class=\"mcnDividerContent\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"min-width:100%;\">\n" +
  "                    <tbody><tr>\n" +
  "                        <td>\n" +
  "                            <span></span>\n" +
  "                        </td>\n" +
  "                    </tr>\n" +
  "                </tbody></table>\n" +
  "<!--            \n" +
  "                <td class=\"mcnDividerBlockInner\" style=\"padding: 18px;\">\n" +
  "                <hr class=\"mcnDividerContent\" style=\"border-bottom-color:none; border-left-color:none; border-right-color:none; border-bottom-width:0; border-left-width:0; border-right-width:0; margin-top:0; margin-right:0; margin-bottom:0; margin-left:0;\" />\n" +
  "-->\n" +
  "            </td>\n" +
  "        </tr>\n" +
  "    </tbody>\n" +
  "</table><table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" class=\"mcnButtonBlock\" style=\"min-width:100%;\">\n" +
  "    <tbody class=\"mcnButtonBlockOuter\">\n" +
  "        <tr>\n" +
  "            <td style=\"padding-top:0; padding-right:18px; padding-bottom:18px; padding-left:18px;\" valign=\"top\" align=\"center\" class=\"mcnButtonBlockInner\">\n" +
  "                <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" class=\"mcnButtonContentContainer\" style=\"border-collapse: separate !important;border-radius: 7px;background-color: #337AB7;\">\n" +
  "                    <tbody>\n" +
  "                        <tr>\n" +
  "                            <td align=\"center\" valign=\"middle\" class=\"mcnButtonContent\" style=\"font-family: Helvetica; font-size: 18px; padding: 18px;\">\n" +
  "                                <a class=\"mcnButton \" title=\"Proceed to Election\" href=\"{url}\" target=\"_self\" style=\"font-weight: normal;letter-spacing: -0.5px;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;\">Proceed to Election</a>\n" +
  "                            </td>\n" +
  "                        </tr>\n" +
  "                    </tbody>\n" +
  "                </table>\n" +
  "            </td>\n" +
  "        </tr>\n" +
  "    </tbody>\n" +
  "</table></td>\n" +
  "\t\t\t\t\t\t\t\t\t\t</tr>\n" +
  "\t\t\t\t\t\t\t\t\t</table>\n" +
  "\t\t\t\t\t\t\t\t\t<!--[if (gte mso 9)|(IE)]>\n" +
  "\t\t\t\t\t\t\t\t\t</td>\n" +
  "\t\t\t\t\t\t\t\t\t</tr>\n" +
  "\t\t\t\t\t\t\t\t\t</table>\n" +
  "\t\t\t\t\t\t\t\t\t<![endif]-->\n" +
  "\t\t\t\t\t\t\t\t</td>\n" +
  "                            </tr>\n" +
  "                            <tr>\n" +
  "\t\t\t\t\t\t\t\t<td align=\"center\" valign=\"top\" id=\"templateFooter\">\n" +
  "\t\t\t\t\t\t\t\t\t<!--[if (gte mso 9)|(IE)]>\n" +
  "\t\t\t\t\t\t\t\t\t<table align=\"center\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" width=\"600\" style=\"width:600px;\">\n" +
  "\t\t\t\t\t\t\t\t\t<tr>\n" +
  "\t\t\t\t\t\t\t\t\t<td align=\"center\" valign=\"top\" width=\"600\" style=\"width:600px;\">\n" +
  "\t\t\t\t\t\t\t\t\t<![endif]-->\n" +
  "\t\t\t\t\t\t\t\t\t<table align=\"center\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" class=\"templateContainer\">\n" +
  "\t\t\t\t\t\t\t\t\t\t<tr>\n" +
  "                                \t\t\t<td valign=\"top\" class=\"footerContainer\"></td>\n" +
  "\t\t\t\t\t\t\t\t\t\t</tr>\n" +
  "\t\t\t\t\t\t\t\t\t</table>\n" +
  "\t\t\t\t\t\t\t\t\t<!--[if (gte mso 9)|(IE)]>\n" +
  "\t\t\t\t\t\t\t\t\t</td>\n" +
  "\t\t\t\t\t\t\t\t\t</tr>\n" +
  "\t\t\t\t\t\t\t\t\t</table>\n" +
  "\t\t\t\t\t\t\t\t\t<![endif]-->\n" +
  "\t\t\t\t\t\t\t\t</td>\n" +
  "                            </tr>\n" +
  "                        </table>\n" +
  "                        <!-- // END TEMPLATE -->\n" +
  "                    </td>\n" +
  "                </tr>\n" +
  "            </table>\n" +
  "        </center>\n" +
  "    </body>\n" +
  "</html>\n";
