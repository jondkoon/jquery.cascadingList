## jquery.cascadingList

jquery.cascadingList is cascading list widget modelled after OSX's finder. It is ideal for applications or websites that need a way of allowing users to traverse hierarchical data.

## Usage
Here is a simple example using folders like you might find on your operating system.

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

## Options
The cascadingList pluging expects an object with the following options






##License
(The MIT License)

Copyright © 2012-now Jon Koon

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the ‘Software’), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED ‘AS IS’, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
