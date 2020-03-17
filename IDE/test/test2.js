let a = 1;
function foo() {
  console.log('foo ',a );
}
foo()
exports.publicfoo = function () {
  a++;
  console.log('publicfoo', a);
}
