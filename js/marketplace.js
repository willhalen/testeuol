function validatenewlead() {
    hideError('errorCelular')
    hideError('errorDocumento')
    hideError('errorEmail')
    hideError('errorNome')
    hideError('NewLeadError')

    var obj = {
        Nome: document.getElementById('Name').value,
        Documento: document.getElementById('Cpf').value,
        Email: document.getElementById('Email').value,
        Celular: document.getElementById('Phone').value,
    }
    try {
        $.ajax({
            type: "POST",
            url: '/home/validatenewlead',
            data: obj,
            success: function (data) {
                sendPin(obj.Celular, true)
            },
            error: function (e) {
                console.log(e);
                var resp = e.responseJSON;
                if (resp != undefined) {
                    if (resp.Celular != undefined) showError('errorCelular', resp.Celular[0])
                    if (resp.Documento != undefined) showError('errorDocumento', resp.Documento[0])
                    if (resp.Email != undefined) showError('errorEmail', resp.Email[0]);
                    if (resp.Nome != undefined) showError('errorNome', resp.Nome[0]);
                    if (resp.message != undefined) showError('NewLeadError', 'Erro ao processar. Tente mais tarde');
                }
                else {
                    if (e.responseText) showError('NewLeadError', e.responseText);
                }
            }
        });
    } catch (e) {
        showError('NewLeadError', 'Erro ao processar. Tente mais tarde');
    }
}

function newlead() {
    var obj = {
        Nome : document.getElementById('Name').value,
        Documento : document.getElementById('Cpf').value,
        Email : document.getElementById('Email').value,
        Celular : document.getElementById('Phone').value,
    }

    try {
        $.ajax({
            type: "POST",
            url: '/home/newlead',
            data: obj,
            success: function (data) {
                localStorage.setItem('leadID', data.data.leadID);
                localStorage.setItem('userName', data.data.nome);
                document.getElementById('pNomeLead').innerText = data.data.nome
                document.getElementById('pTelefoneLead').innerText = data.data.celular
                document.getElementById('pEmailLead').innerText = data.data.email
                showUser();
            },
            error: function (e) {
                showError('ValidateError', e.responseText);
            }
        });
    } catch (e) {
        showError('ValidateError', 'Erro ao processar. Tente mais tarde');
    }
}

function sendPin(celular, move) {
    if (celular != '') {
        localStorage.setItem('celular', celular);
    }
    else {
        celular = localStorage.getItem('celular')
    }
    try {
        $.ajax({
            type: "GET",
            url: '/home/sendpin?celular=' + celular,
            success: function (data) {
                localStorage.setItem('token', data.value);
                if(move) clickAria('#tab-cod-sms', 'collapseThree')
            },
            error: function (e) {
                showError('NewLeadError', e.responseText)
            }
        });
    } catch (e) {
        showError('NewLeadError', 'Erro ao processar. Tente mais tarde');
    }
}

function validatePin() {
    hideError('ValidateError')
    if (document.getElementById('Code').value == '') {
        showError('ValidateError', 'Informe o código enviado no celular');
        return;
    }
    var obj = {
        Code: document.getElementById('Code').value,
        Token: localStorage.getItem('token')
    }
    try {
        $.ajax({
            type: "POST",
            url: '/home/validatepin',
            data: obj,
            success: function (data) {
                newlead();
                clickAria('#tab-search', 'tab-search')
            },
            error: function (e) {
                showError('ValidateError', 'Erro ao validar PIN');
            }
        });
    } catch (e) {
        showError('ValidateError', 'Erro ao validar PIN');
    }
}

function showUser() {
    document.getElementById('divUser').style.visibility = '';
    document.getElementById('pUser').innerText = localStorage.getItem('userName')
}

function login() {
    try {
        hideError('PhoneLoginError')
        if (document.getElementById('PhoneLogin').value == '') {
            showError('PhoneLoginError', 'Informe o celular cadastrado')
            return;
        }
        var obj = {
            Celular: document.getElementById('PhoneLogin').value
        };
        $.ajax({
            type: "POST",
            url: '/home/login',
            data: obj,
            success: function (data) {
                localStorage.setItem('leadID', data.data.leadID);
                localStorage.setItem('userName', data.data.nome);
                document.getElementById('pNomeLead').innerText = data.data.nome
                document.getElementById('pTelefoneLead').innerText = data.data.celular
                document.getElementById('pEmailLead').innerText = data.data.email
                clickAria('#tab-search', 'collapseThree')
                showUser();
                
            },
            error: function (e) {
                showError('PhoneLoginError', 'Cadastro não encontrado. Realize o cadastro para acessar por aqui')
            }
        });
    } catch (e) {
        showError('PhoneLoginError', 'Não foi possível validar o celular. Tente mais tarde')
    }
}

function filter() {

    cleanUl('ulProduto');
    cleanUl('ulCredito');
    cleanUl('ulEntrada');
    cleanUl('ulParcelas');
    cleanUl('ulValorParcelas');
    cleanUl('ulProximoVencimento');
    cleanUl('ulFalarVendedor');
    var categoriaID = 0;
    var valorCredito = 0.0;

    if (document.getElementById('btnradio1').checked) categoriaID = 1 //imóvel
    else if (document.getElementById('btnradio2').checked) categoriaID = 2 // carro
    else if (document.getElementById('btnradio3').checked) categoriaID = 3 // moto
    else categoriaID = 4 //serviço

    valorCredito = parseFloat(document.getElementsByClassName('irs-single')[0].innerText.replace('R$', '').replace('.',''));

    try {
        $.ajax({
            type: "GET",
            url: '/home/filter?CategoriaID=' + categoriaID + '&ValorCredito=' + valorCredito,
            success: function (data) {
                if (data.length == 0) {
                    document.getElementById('filterNone').style.display = '';
                }
                else {
                    document.getElementById('filterNone').style.display = 'none';
                    for (var i = 0; i < data.length; i++) {
                        var marketPlaceProposta = data[i];
                        appendLi('ulProduto', marketPlaceProposta.categoriaID == 1 ? 'Imóvel' : marketPlaceProposta.categoriaID == 2 ? 'Automóvel' :
                            marketPlaceProposta.categoriaID == 3 ? 'Moto' : 'Serviço');
                        appendLi('ulCredito', marketPlaceProposta.valorCredito.toLocaleString(undefined, { minimumFractionDigits: 2 }))
                        appendLi('ulEntrada', marketPlaceProposta.valorVenda.toLocaleString(undefined, { minimumFractionDigits: 2 }))
                        appendLi('ulParcelas', marketPlaceProposta.parcelasRestantes)
                        appendLi('ulValorParcelas', marketPlaceProposta.valorParcela.toLocaleString(undefined, { minimumFractionDigits: 2 }))
                        appendLi('ulProximoVencimento', new Date(marketPlaceProposta.proximoVencimento).toLocaleDateString())
                        appendLiButton('ulFalarVendedor', marketPlaceProposta.propostaID);
                        //document.getElementById('ulFalarVendedor').appendChild(' <li><a class="bt-contato" data-bs-toggle="modal" href="#contato" role="button"></a> </li>')
                    }
                }
                clickAria('#section-result', 'section-result')
            },
            error: function (e) {
                console.log(e);
            }
        });
    } catch (e) {
        console.log(e);
    }
}

function sendContact() {
    var messageLabel = document.getElementById('ContactMessage')
    try {
        messageLabel.style.color = 'red';
        console.log('sendcontact')
        var obj = {
            PropostaID : document.getElementById('PropostaID').innerText,
            Comentario: document.getElementById('Message').value,
            LeadID : localStorage.getItem('leadID')
        }
        
        $.ajax({
            type: "POST",
            url: '/home/sendcontact',
            data: obj,
            success: function (data) {
                messageLabel.innerText = 'Mensagem enviada com sucesso ao vendedor!'
                messageLabel.style.color = '#5451FB';
                setTimeout(() => {
                    closeModal();
                }, 5000);
            },
            error: function (e) {
                console.log(e.responseJSON)
                if (e.responseJSON && e.responseJSON.Comentario) messageLabel.innerText = e.responseJSON.Comentario[0]
                else messageLabel.innerText = e.responseText
            }
        });
    } catch (e) {
        messageLabel.innerText = 'Não foi possível enviar a mensagem. Tente mais tarde'
    }
}

function alterarProposta(propostaID){
    document.getElementById('PropostaID').innerText = propostaID;
    document.getElementById('ContactMessage').innerText = '';
}

function appendLiButton(id, text) {
    var ul = document.getElementById(id);
    var li = document.createElement("li");
    var a = document.createElement("a");
    a.setAttribute('class', 'bt-contato');
    a.setAttribute('href', "#contato");
    a.setAttribute('data-bs-toggle', 'modal');
    a.setAttribute('role', 'button');
    a.setAttribute('onclick', 'alterarProposta(\''+ text + '\')')
    li.appendChild(a);
    ul.appendChild(li);
    
}
function appendLi(id, text) {
    var ul = document.getElementById(id);
    var li = document.createElement("li");
    li.appendChild(document.createTextNode(text));
    ul.appendChild(li);
}
function closeModal() {
    document.getElementById('btCloseModal').click();
    document.getElementById('Message').value = ''
    document.getElementById('ContactMessage').innerText = '';
}
function clickAria(destination, ariaControl) {
    var link = document.createElement("a");
    link.href = "javascript:void";
    link.id = 'someLink';
    link.setAttribute('data-bs-toggle', 'collapse');
    link.setAttribute('data-bs-target', destination);
    link.setAttribute('aria-expanded', 'false');
    link.setAttribute('aria-controls', ariaControl);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
function cleanUl(id) {
    var root = document.getElementById(id)
    while (root.children.length > 1) {
        root.removeChild(root.children[1]);
    }
}

function fMasc(objeto, mascara) {
    obj = objeto
    masc = mascara
    setTimeout("fMascEx()", 1)
}
function fMascEx() {
    obj.value = masc(obj.value)
}
function mCPF(cpf) {
    cpf = cpf.replace(/\D/g, "")
    cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2")
    cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2")
    cpf = cpf.replace(/(\d{3})(\d{1,2})$/, "$1-$2")
    return cpf
}
function mTel(tel) {
    tel = tel.replace(/\D/g, "")
    tel = tel.replace(/^(\d)/, "($1")
    tel = tel.replace(/(.{3})(\d)/, "$1)$2")
    if (tel.length == 9) {
        tel = tel.replace(/(.{1})$/, "-$1")
    } else if (tel.length == 10) {
        tel = tel.replace(/(.{2})$/, "-$1")
    } else if (tel.length == 11) {
        tel = tel.replace(/(.{3})$/, "-$1")
    } else if (tel.length == 12) {
        tel = tel.replace(/(.{4})$/, "-$1")
    } else if (tel.length > 12) {
        tel = tel.replace(/(.{4})$/, "-$1")
    }
    return tel;
}

function showError(id, message) {
    var el = document.getElementById(id);
    el.innerText = message;
    el.style.display = '';
}
function hideError(id) {
    var el = document.getElementById(id);
    el.innerText = '';
    el.style.display = 'none';
}

function logout() {
    document.getElementById("divUser").style.visibility = 'hidden';
    window.location.reload();
}