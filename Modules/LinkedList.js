function LinkedList(eqFunc) {

	this.startNode = null;
    this.eqFunc = eqFunc;
    this.length = 0;


    // Node object
    this.Node = function(data, parentList) {

        this.data = data;
        this.next = null;
        this.equals = function(node) { return parentList.eqFunc(this, node) };
        this.parentList = parentList;
    }
    
    this.clear = function() {
    	
    	this.startNode = null;
        this.length = 0;
    }

    this.add = function(data) {

        // Create the new node
        let newNode = new this.Node(data, this);
        let currentNode = this.startNode;

        // Move the node to its correct new spot
        if(currentNode != null) {

            while(currentNode.next != null) {

                currentNode = currentNode.next;
            }

            currentNode.next = newNode;
        }
        else
            this.startNode = newNode;
            
        this.length++;
        
    } // add

    this.insert = function(data, position) {

        // Create the new node
        let newNode = new this.Node(data, this);
        let currentNode = this.startNode;

        // Move the node to its correct new spot
        if(currentNode != null) {

            let positionAt = 1;

            while(currentNode.next != null && positionAt < position) {

                currentNode = currentNode.next;
                positionAt++;
            }

            // case 1: position = 0
            if(position == 0) {

                newNode.next = this.startNode;
                this.startNode = newNode;
            }

            // case 2: 0 < position < null
            else if(currentNode.next != null) {

                newNode.next = currentNode.next;
                currentNode.next = newNode;
            }

            // case 3: position > null
            else {

                currentNode.next = newNode;
            }
        }
        else
            this.startNode = newNode;
            
        this.length++;
        
    } // insert

    this.delete = function(boolFunc) {

        let prevNode = null;
        let currentNode = this.startNode;
        
        if(this.startNode == null) return;

        // case 1: node is at beginning
        if(boolFunc(this.startNode)) {

            this.startNode = this.startNode.next;
            this.length--;
        }
        else {

            let found = false;
            while(currentNode != null && !found) {

                prevNode = currentNode;
                currentNode = currentNode.next;

                if(currentNode != null) {

                    // case 2 and 3
                    if(boolFunc(currentNode)) {

                        found = true;
						
                        prevNode.next = currentNode.next;
                        this.length--;
                    }
                }
            }
        }
    } // delete

    this.get = function(position) {
        
        // To be implemented

    } // get

    this.find = function(boolFunc) {

        let position = 0;
        let currentNode = this.startNode;

        while(currentNode != null) {

            if(boolFunc(currentNode)) {

                return position;
            }

            position++;
            currentNode = currentNode.next;
        }

        return -1;
    } // find
    
    this.iterate = function(boolFunc) { // boolFunc(node)
    	
        let element = this.startNode;
        let newList = new LinkedList(this.eqFunc);
        
        while(element != null) {
        
        	if(boolFunc(element))
                newList.add(element.data);
            
            element = element.next;
        }
    	return newList;
    } // iterate
    
    this.iterateOver = function(boolFunc) { // boolFunc(firstNode, secondNode)
    	
        let outerElement = this.startNode;
        let innerElement = this.startNode;
        let newList = new LinkedList(this.eqFunc);
        
        while(outerElement != null) {
        
        	innerElement = outerElement.next;
            
            while(innerElement != null) {
            
                if(boolFunc(outerElement, innerElement)) {
					
                    if(newList.find(function(node) {return node.equals(outerElement)}) == -1)
                    	newList.add(outerElement.data);
                    if(newList.find(function(node) {return node.equals(innerElement)}) == -1)
                    	newList.add(innerElement.data);
                } // boolFunc invoked
                
                innerElement = innerElement.next;
                
            
            } // inner loop
            
            outerElement = outerElement.next;
        } // outer loop
        
        return newList;
        
    } // iterateOver

    this.doubleIterate = function(boolFunc, funIfEq) {
    
    	let outerElement = this.startNode;
        let innerElement = this.startNode;
        
        while(outerElement != null) {
        
        	innerElement = this.startNode;
        	while(innerElement !=null) {
            	
                if(boolFunc(outerElement, innerElement)) {
                
                	funIfEq(outerElement, innerElement);
                }
                
                innerElement = innerElement.next;
            
            }
            
            outerElement = outerElement.next;
        
        }
    
    } // doubleIterate

    this.sort = function(boolFunc) {

        // Bubblesort
        if(this.length < 2) return;
        
        var prevNode;
        var currentNode;
        var swapped;
        
        do {
        
        	swapped = false;
        	prevNode = this.startNode;
            currentNode = this.startNode.next;
            
            for(var i = 1; i<this.length; i++) {
            
            	if(boolFunc(prevNode, currentNode)) {
                
                	var tempData = prevNode.data;
                    prevNode.data = currentNode.data;
                    currentNode.data = tempData;
                    swapped = true;
                }
            	
                prevNode = prevNode.next;
                currentNode = currentNode.next;
            }
            
        } while(swapped);
        
    } // sort


    this.display = function(dispFunc) {

        document.querySelector("p").innerHTML += this.getString(dispFunc);

    } // display


    this.getString = function(dispFunc) {

        var currentNode = this.startNode;
        var hasDispFunc = typeof dispFunc == "function";
        var toDisplay, returnStr;

        returnStr = "";

        while(currentNode != null) {

            if(hasDispFunc)
                toDisplay = dispFunc(currentNode);
            else
                toDisplay = currentNode.data;

            returnStr += toDisplay + " ";

            currentNode = currentNode.next;
        }
    
        return returnStr;

    } // getString

} // LinkedList

function checkIfEqual(f, s) {
	if(f != null && s != null)
    	return f.data == s.data;
    
    return false;
}