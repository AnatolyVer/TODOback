

const html = (to, token) => {
    return (
        '<h1>Hello there!</h1>' +
        '<p>Hi there! You received this letter because you are using the best life management service ever! You just need to verificate your email by clicking this link</p>' +
        '<p>Just ignore it, if you doesn&#39;t even know about us(((</p>' +
        '<a href=\'http://localhost:5173/email_verification/&token=' + token + '\'>Click me!</a>'
    )
}



export default html