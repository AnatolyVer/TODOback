class userDto{
    user_id
    todos
    accessToken
    login
    tags
    constructor(obj) {
        this.user_id = obj._id
        this.todos = obj.todos
        this.accessToken = obj.accessToken
        this.login = obj.login
        this.tags = obj.tags
    }
}

export default userDto