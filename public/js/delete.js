$('.delete').click(function() {
    var response = confirm("do you want to delete")
    title = this.id;
    console.log(title)
    if(response === true){
        $.ajax({
            type: 'DELETE',
            url: '/delete_news',
            method: 'delete',
            data: {"title":title},
            success: function(data){
                console.log('data is '+JSON.stringify(data));
                window.location.reload()
            },
            error: function(){
                alert('No data');
            }
        });
    }
    else{
        console.log("not deleted")
    }
});