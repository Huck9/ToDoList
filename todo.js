(function () {
        let itemVal = document.querySelector('#item'),
            itemDate = document.querySelector('#itemDate'),
            add = document.querySelector('#buttonAdd'),
            list = document.querySelector('#list'),
            error = document.querySelector('#error-massage'),
            buttonFind = document.querySelector('.szukaj');


        add.addEventListener('click', function (e) {
            e.preventDefault();
            if (itemVal.value.length > 2 && itemVal.value.length < 256) {
                if (itemDate.value && new Date(itemDate.value).setHours(0, 0, 0, 0) >= new Date().setHours(0, 0, 0, 0)) {
                    list.innerHTML += '<li>' + itemVal.value + " ( " + itemDate.value + ' ) <button class="edit btn btn-secondary">Edit</button><button class="delete btn btn-secondary">delete</button></li>';
                    store({name: itemVal.value, date: itemDate.value});
                    itemVal.value = "";
                    itemDate.value = "";
                    error.innerHTML = "";
                    error.classList.remove('alert', 'alert-danger');
                } else {
                    console.log("Zła data");
                    error.innerHTML = "Zła data!";
                    error.classList.add('alert', 'alert-danger');
                }
            } else {
                console.log("Zła długość zadania");
                error.innerHTML = "Zła długość zadania!";
                error.classList.add('alert', 'alert-danger');
            }
        })

        list.addEventListener('click', function (e) {
            e.preventDefault();
            let check = e.target;
            let items = JSON.parse(window.localStorage.getItem('myitems'));
            if (check.classList.contains("delete")) {
                check.parentNode.remove();
                items = items.filter(function (r) {
                    return check.parentNode.innerHTML.split(" ")[0] !== r.name;
                })
                window.localStorage.setItem('myitems', JSON.stringify(items));
            } else if (check.classList.contains("edit")) {
                check.parentNode.innerHTML += "<div></nr><input type='text' class='itemValEdit' value='" + check.parentNode.innerHTML.split(" ")[0] + "'><input type='date' class='itemDateEdit' value='" + new Date(check.parentNode.innerHTML.split(" ")[2]).toISOString().slice(0, 10) + "'><button class='save btn btn-danger'>save</button></div>";

            } else if (check.classList.contains("save")) {
                let editVal = check.parentNode.querySelector('.itemValEdit');
                let editDate = check.parentNode.querySelector('.itemDateEdit');
                let value = check.parentNode.parentElement.innerHTML.split(" ")[0];
                let valueDate = check.parentNode.parentElement.innerHTML.split(" ")[2];
                if (editVal.value.length > 2 && editVal.value.length < 256) {
                    if (editDate.value && new Date(editDate.value).setHours(0, 0, 0, 0) >= new Date().setHours(0, 0, 0, 0)) {
                        check.parentNode.remove();
                        items.forEach(val => {
                            if (val.name === value && val.date === valueDate) {
                                val.name = editVal.value;
                                val.date = editDate.value;
                            }
                        })
                        window.localStorage.setItem('myitems', JSON.stringify(items));
                        editVal.value = "";
                        editDate.value = "";
                        error.innerHTML = "";
                        error.classList.remove('alert', 'alert-danger');
                        window.location.reload();
                    } else {
                        console.log("Zła data");
                        error.innerHTML = "Zła data!";
                        error.classList.add('alert', 'alert-danger');
                    }
                } else {
                    console.log("Zła długość zadania");
                    error.innerHTML = "Zła długość zadania!";
                    error.classList.add('alert', 'alert-danger');
                }

            }


        }, false)

        buttonFind.addEventListener('click', function (e) {
            let text = document.querySelector('#searchText');
            let items = JSON.parse(window.localStorage.getItem('myitems'));
            list.innerHTML = "";
            getValues();
            if (text.value.length >= 3) {
                let dic = [];

                items.forEach(val => {
                    dic.push(val.name.search(text.value))
                })
                for (let i = 0; i < dic.length; i++) {

                    if (dic[i] !== -1) {
                        list.children[i].style.backgroundColor = 'yellow';
                        let line = list.children[i].innerHTML;
                        list.children[i].innerHTML = line.slice(0, dic[i]) + "<a style='color:red'>" + line.slice(dic[i], dic[i] + text.value.length) + "</a>" + line.slice(text.value.length, line.length);
                    }
                }
                error.innerHTML = "";
                error.classList.remove('alert', 'alert-danger');
            } else {
                error.innerHTML = "Za mało znaków!";
                error.classList.add('alert', 'alert-danger');
            }

        }, false)

        function store(item) {
            let items = JSON.parse(window.localStorage.getItem('myitems'));
            items = items === null ? [] : items;
            console.log(items);
            window.localStorage.setItem('myitems', JSON.stringify([...items, item]));
        }

        function getValues() {
            let storedValues = JSON.parse(window.localStorage.getItem('myitems'));
            if (!storedValues) {
                list.innerHTML = '';
            } else {
                storedValues.forEach(val => {
                    if (val) {
                        list.innerHTML += '<li>' + val.name + ' ( ' + val.date + ' ) ' + '<button class="edit btn btn-secondary">Edit</button><button class="delete btn btn-secondary">delete</button></li>';
                    }
                })
            }
        }

        getValues();
    }
)();