

function viewModel() {
 var self = this;
 self.msg = ko.observable()
 self.show = function() {
 self.msg(true)
 }
 self.hide = function() {
 self.msg(false)
 }
};
ko.applyBindings(new viewModel());