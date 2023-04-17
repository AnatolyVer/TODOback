class todoDto{
    user_id
    label
    id
    description
    priority
    date
    done
    constructor(obj) {
        this.user_id = obj.user_id
        this.label = obj.label
        this.id = obj._id
        this.description = obj.description
        this.priority = obj.priority
        this.date = obj.date
        this.done = obj.done
    }
}

export default todoDto