module.exports.filterStatus = (req) => {
    var status = "";

    const filterStatus = [
        {
            name: "All",
            status: "",
            class: ""
        },
        {
            name: "Active",
            status: "active",
            class: ""
        },
        {
            name: "Inactive",
            status: "inactive",
            class: ""
        }
    ]

    if (req.query.status === 'active') {
        status = req.query.status;
        filterStatus[0].class = "";
        filterStatus[1].class = "active";
        filterStatus[2].class = "";
    } else if (req.query.status === 'inactive') {
        status = req.query.status;
        filterStatus[0].class = "";
        filterStatus[1].class = "";
        filterStatus[2].class = "active";
    } else {
        filterStatus[0].class = "active";
        filterStatus[1].class = "";
        filterStatus[2].class = "";
    }

    const res = {
        filterStatus: filterStatus
    }
    if (status !== "") {
        res.status = status;
    }

    return res;
}