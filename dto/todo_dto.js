class todoDto{
    label
    id
    description
    priority
    date
    done
    constructor(obj) {
        this.label = obj.label
        this.id = obj._id
        this.description = obj.description
        this.priority = obj.priority
        this.date = obj.date
        this.done = obj.done
    }
}

export default todoDto