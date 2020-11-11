const index = {
    init: () => {
        $('#search').change((event) => {
            $.ajax({
                url: '/rest/searchTransaction',
                type: 'GET',
                data: {
                    searchInput: event.target.value
                },
                success: (response) => {
                    console.log(response);
                }
            });
        });
    }
}
index.init();