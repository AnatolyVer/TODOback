class userDto{
    user_id
    todos
    accessToken
    login
    constructor(obj) {
        this.user_id = obj._id
        this.todos = obj.todos
        this.accessToken = obj.accessToken
        this.login = obj.login
    }
}

export default userDto