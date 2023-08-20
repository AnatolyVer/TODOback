class userDto{
    user_id
    todos
    accessToken
    login
    tags
    name
    picture
    regType
    emailIsVerified
    constructor(user, accessToken) {
        this.user_id = user._id
        this.todos = user.todos
        this.accessToken = accessToken
        this.login = user.login
        this.tags = user.tags
        this.name = user.name
        this.picture = user.picture
        this.regType = user.regType
        this.emailIsVerified = user.emailIsVerified
    }
}

export default userDto