var name;
var to_be_updated;
        $(document).ready(function() {
            $('#myTable').DataTable();
            });
        // edit data
        $('.update').click(function() {
            id= this.id;
                $.ajax({
                    type: 'POST',
                    url: '/find_by_name',
                    data: {"title":id},
                    success: function(data){
                      
                            to_be_updated = data[0].title;
                            $("#title").attr("value", data[0].title);
                            $("#desc").text(data[0].desc);
                            $("#url").attr("value", data[0].url);
                            $("#urltoimage").attr("value", data[0].urltoimage);
                            $('#Modal').modal({show: true});
                        },
                    error: function(){
                        alert('No data');
                    }
                    });
            });




            
            // update data
                  $(function(){
                      $('#update_table').on('click', function(e){
                        console.log('i am indsd');
                        var data = $('#update_news').serialize();
                        console.log(data)
                        debugger;
                        console.log(JSON.stringify(data));
                        e.preventDefault();
                        $.ajax({
                          url: '/edit_news',
                          type:'PUT',
                          data : data,
                          success: function(data){
                            console.log('i am googleapis');
                            window.location.reload()
                          },
                          error: function(){
                            alert('No data');
                          }
                      });
                  });
                  });