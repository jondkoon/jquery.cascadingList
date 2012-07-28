##jquery.cascadingList

jquery.cascadingList is cascading list widget modelled after OSX's finder. It is ideal for applications or websites that need a way of allowing users to traverse hierarchical data.

##Usage
Here is a simple example using folders like you might find on your operating system.

Assume #cascading-list is a `<div>`

```javascript
var folders = [
    {
        name: "folder", id: 1
    },
    {
        name: "folder2", id: 2
    },
    {
        name: "file1.txt",
        id: 3,
        parent: 1
    },
    {
        name: "file2.txt",
        id: 4,
        parent: 2
    },
    { name: "file3.txt", id: 7 },
];
$("#cascading-list").cascadingList({
    data: folders,
    display: 'name',
    value: 'id',
    parent: 'parent'
}).change(function(){
    var value = $(this).cascadingList('value');
    console.log(value);
});
```

##Options
The cascadingList plugin expects an object with the following required options:  

- data: an array of item objects that represents your hierarchichal data
- value: used when setting and retrieving the value from cascadingList
- display: used for displaying an item to the user
- parent: the value of this items parent used when forming the hierarchichal structure

value, display, and parent can be given in three forms:

- key string: tells cascadingList what property on the item object to use
- function: will be called in the context of the item object and will use the return value. The function will be executed for each item once at initialization
- static string: if a string that is not a property of the item object is given a static string will be used

The following are some optional options:

- change: a function that will be called when the value is changed. The new value will be passed.
- defaultValue: the initial value to use after initializing the widget. If none is specified the first item will be used.
- scrollable: a boolean that when set to true forces the widget to hide empty child panels and to scroll if the panel widths start to exceed the container

##Methods
The following code demonstrates the methods available on the cascadingList widget:

```javascript
var cl = $("#cascading-list");

//retrieves the current value
var value = cl.cascadingList('value');

//sets the current value
cl.cascadingList('value',3);

//listen to the widgets change event
cl.bind('change',function(){
    console.log('change');
});

//returns an array of values of the children of the given item.
//expects an item value as a parameter
var children = cl.cascadingList('children',1);

//returns the number of children directly under a particular item
//expects an item value as a parameter
//slightly faster then querying the length property children
var childrenCount = cl.cascadingList('childrenCount',1);

//determines what level of the hierarchy has the most items and returns the count
//this is good for determining the listHeight if you didn't want any overflow
var listHeight = cl.cascadingList('highestRowCount');

//prints item hierarchy as an unordered list for verification purposes
cl.cascadingList('printTree');
```

##Special Thanks
Initial development was sponsored by <a href="https://www.aarons.com/">Aaron's</a> as a part of a <a href="http://provenmethod.com">Proven Method</a> professional services project.

##License
(The MIT License)

Copyright © 2012-now Jon Koon

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the ‘Software’), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED ‘AS IS’, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
