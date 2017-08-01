var itemName = getParameterByName('item'),
    database = firebase.database();

const ref = database.ref().child(itemName);
ref.once('value').then(function (snap) {
    $("#content,#bottom-bar").removeClass('hide');
    $("#loader").remove();
    var item = snap.val();
    $("#earring-cost").html('Rs. ' + item.value);
    $("#earring-main-description span").html(itemName);
    $("#earring-main-image").attr('src', item.url).removeClass('hide');
    $("#tryUrl").val(item.tryUrl);
});