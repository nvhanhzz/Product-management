module.exports.filterStatus = (query) => {
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

    if (query.status === 'active') {
        status = query.status;
        filterStatus[0].class = "";
        filterStatus[1].class = "active";
        filterStatus[2].class = "";
    } else if (query.status === 'inactive') {
        status = query.status;
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