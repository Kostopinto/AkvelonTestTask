window.onload = () => {
    loadData();
};


window.onclick = ({
    target
}) => {

    if (target.id == 'addButton') {
        document.getElementById('CreateInvoice').style.display = 'inherit';
        document.getElementById('Invoices').style.display = 'none';
    }
    if (target.id == 'buttonSave') {
        document.getElementById('CreateInvoice').style.display = 'none';
        document.getElementById('Invoices').style.display = 'inherit';

        pushData();
    }
    if (target.className == 'del') {
        const isDelete = confirm('Are you sure?');
        if (isDelete) {
            deleteData(target.getAttribute('invoiceId'));
        }
    }
};

function deleteData(id) {
    fetch(`http://localhost:3000/invoices/${id}`, {method: 'delete'})
        .then(() => loadData());
}

function loadData() {
    document.formInvoice.reset();
    fetch('http://localhost:3000/invoices')
        .then((response) => response.json())
        .then((response) => {
            const myTable = document.getElementById("myTable");
            const head = `<tr>
                    <th>Create</th>
                    <th>No</th>
                    <th>Supply</th>
                    <th>Comment</th>
                    <th></th>
            </tr>`;
            const list = response.map(item => {
                return `<tr>
                    <td>${item.date_created}</td>
                    <td>${item.number}</td>
                    <td>${item.date_supplied}</td>
                    <td>${item.comment}</td>
                    <td><button class="del button" invoiceId="${item.id}">X</button></td>
                </tr>`;
            });
            myTable.innerHTML = head + list.join('');
        });
}

function pushData() {
    const body = {
        date_created: document.formInvoice.date_created.value,
        number: document.formInvoice.number.value,
        date_supplied: document.formInvoice.date_supplied.value,
        comment: document.formInvoice.comment.value
    };


    const options = {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    };

    fetch('http://localhost:3000/invoices', options)
        .then(() => loadData());
}


const textarea = document.getElementById('number');
const bs = document.getElementById('buttonSave');
textarea.onkeyup = () => {
    if (textarea.value.length < 3) {
        bs.disabled = true;
    } else {
        bs.disabled = false;
    }
};
