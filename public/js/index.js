const index = {
    createTransaction: () => {
        const name = $('#create-transaction-form #name');
        const message = $('#create-transaction-form #message');
        const amount = $('#create-transaction-form #amount');
        const saveButton = $('#create-transaction-form #create-transaction');
        const saveButtonText = $('#create-transaction-form #create-transaction span');
        const saveButtonSpinner = $('#create-transaction-form .save-spinner');
        
        $(saveButton).click(() => {
            return new Promise((resolve, reject) => {
                saveButton.attr('disabled', true);
                saveButtonSpinner.removeAttr('hidden');
                saveButtonText.hide();
                setTimeout(() => {
                    resolve(1);
                }, 1000);
            }).then(() => {
                $.ajax({
                    url: '/rest/createTransaction',
                    type: 'POST',
                    data: {
                        name: name.val(),
                        message: message.val(),
                        amount: amount.val()
                    },
                    success: (response) => {
                        if (response.errors) {
                            for (let i = 0; i < response.errors.length; i++) {
                                afterTransactionCreationStyle();
                                $('#' + response.errors[i].param).css({'border-color': 'red'});
                                $('.' + response.errors[i].param).text(response.errors[i].msg);
                                saveButton.removeAttr('disabled', true);
                                saveButtonSpinner.attr('hidden', true);
                                saveButtonText.show();
                            }
                        } else {
                            Swal.fire({
                                icon: 'success',
                                title: response,
                                showConfirmButton: false,
                                timer: 1500
                            });
                            afterTransactionCreationStyle();
                            saveButton.removeAttr('disabled', true);
                            saveButtonSpinner.attr('hidden', true);
                            saveButtonText.show();
                            name.val('');
                            message.val('');
                            amount.val('');
                        }
                    },
                    error: (response) => {
                        Swal.fire({
                            icon: 'error',
                            title: response.responseText,
                            showConfirmButton: true
                        });
                    }
                })
            });
        });
    },
    search: () => {
        $('#search').change((event) => {
            const searchInputValue = event.target.value.trimLeft();
            const searchResultMarkup = $('div #search-result');
            const searchResultTableBody = $('div #search-result table tbody');
            const resultPreLoader = `
                <div class="spinner-border search-spinner" role="status">
                    <span class="sr-only">Loading...</span>
                </div>
            `;
            return new Promise((resolve) => {
                searchResultMarkup.html(resultPreLoader);
                setTimeout(() => {
                    resolve(true);
                }, 1000);
            }).then(() => {
                $.ajax({
                    url: '/rest/searchTransaction',
                    type: 'GET',
                    data: {
                        searchInput: searchInputValue
                    },
                    success: (response) => {
                        let markupResult = '';
                        if (response.length > 0) {
                            searchResultMarkup.html(`
                                <table class="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">Name</th>
                                            <th scope="col">Message</th>
                                            <th scope="col">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    </tbody>
                                </table>
                            `);
                            for (let i = 0; i < response.length; i++) {
                                markupResult = `
                                    <tr>
                                        <td>${response[i].name}</td>
                                        <td>${response[i].message}</td>
                                        <td>${response[i].amount}</td>
                                    </tr>
                                `;
                                searchResultTableBody.append(markupResult);
                            }
                        } else {
                            markupResult = `
                                <ul class="list-group">
                                    <li class="list-group-item active">No transaction matched</li>
                                </ul>
                            `;
                            searchResultMarkup.html(markupResult);
                        }
                    }
                });
            });
        });
    },
    voiceCommand: () => {
        const searchInput = $('#search');
        const micListenButton = $('#mic-listen');
        const micListenIcon = $('#mic-listen-icon');
        const micMuteIcon = $('#mic-mute-icon');

        micListenIcon.hide();
        micMuteIcon.show();

        // https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (typeof SpeechRecognition === "undefined") {
          alert("<b>Browser does not support Speech API. Please download latest chrome.<b>");
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;

        // event handler that returns recognition service result
        recognition.onresult = event => {
            const last = event.results.length - 1;
            const res = event.results[last];
            const text = res[0].transcript;

            // we trigger the search when the speech is final
            if (res.isFinal) {
                searchInput.trigger('change');
            } else {
                searchInput.val(text);
            }
         }

         // event listener for listening to speech recognition
         let listening = false;
         micListenButton.click(() => {
            if (listening) {
                recognition.stop();
                
                micListenIcon.hide();
                micMuteIcon.show();
                micListenButton.removeClass('btn-success').addClass('btn-danger');
             } else {
                recognition.start();

                micListenIcon.show();
                micMuteIcon.hide();
                micListenButton.removeClass('btn-danger').addClass('btn-success');
             }
             listening = !listening;
         });
    }
}

index.createTransaction();
index.search();
index.voiceCommand();

function afterTransactionCreationStyle() {
    $('.name').text('');
    $('.message').text('');
    $('.amount').text('');
    $('#name').css({'border': '1px solid #ced4da'});
    $('#message').css({'border': '1px solid #ced4da'});
    $('#amount').css({'border': '1px solid #ced4da'});
}