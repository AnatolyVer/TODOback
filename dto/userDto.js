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
    constructor(obj) {
        this.user_id = obj._id
        this.todos = obj.todos
        this.accessToken = obj.accessToken
        this.login = obj.login
        this.tags = obj.tags
        this.name = obj.name
        this.picture = obj.picture
        this.regType = obj.regType
        this.emailIsVerified = obj.emailIsVerified
    }
}

export default userDto