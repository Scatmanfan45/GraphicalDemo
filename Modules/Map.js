

class Map {

    // Constructor
    constructor(width, height, numHorVoxels, numVerVoxels) {

        this.width = width;
        this.height = height;
        this.numHorVoxels = numHorVoxels;
        this.numVerVoxels = numVerVoxels;
        this.voxelWidth = this.width/this.numHorVoxels;
        this.voxelHeight = this.height/this.numVerVoxels;

        // For LinkedLists
        this.eqFunc = function(a,b) {return a.data == b.data}


        // Create Voxel and Edge linked lists

        // Create Voxels
        this.voxels = [];
        for(var i = 0; i < this.numHorVoxels; i++) {

            this.voxels[i] = [];
            for(var e = 0; e < this.numVerVoxels; e++) {

                this.voxels[i][e] = new LinkedList(this.eqFunc);
            }
        }

        // Create Edges
        this.horEdges = [];
        this.verEdges = [];

        // Create instanceList LinkedList
        this.instanceList = new LinkedList(this.eqFunc);

        // Create horizontal edges
        for(var i = 0; i < this.numHorVoxels; i++) {

            this.horEdges[i] = [];
            for(var e = 0; e < this.numVerVoxels-1; e++) {

                this.horEdges[i][e] = new LinkedList(this.eqFunc);
            }
        }

        // Create vertical edges
        for(var i = 0; i < this.numHorVoxels-1; i++) {

            this.verEdges[i] = [];
            for(var e = 0; e < this.numVerVoxels; e++) {

                this.verEdges[i][e] = new LinkedList(this.eqFunc);
            }
        }
        
    }


    // Get all game objects at a point
    getGameObjectsPoint(x, y) {

        // Setup list to be returned
        var toReturn = new LinkedList(this.eqFunc);

        // Add from correct voxel
        let voxel = this.voxels[max(0, min(Math.floor(x / this.voxelWidth))), max(0, min(Math.floor(y / this.voxelHeight)))];
        let iterFunc = function(node) {
            if(overlaps((x, y, node.data.x, node.data.y, node.data.width, node.data.height))) {
                
                // Add only if node isn't already present
                var noDuplicates = true;
                toReturn.iterate(function(nestedNode) {if(node.data == nestedNode.data) noDuplicates = false});
                if(noDuplicates)
                    toReturn.add(node.data);
            }
        }
        voxel.iterate(iterFunc);

        // Add from applicable edges
        // only if point is in map bounds
        if(x >= 0 && y >= 0 && x < this.voxelWidth*this.numHorVoxels && y < this.voxelHeight*this.numVerVoxels) {

            var xEdge, yEdge;
            xEdge = floor(x / this.voxelWidth);
            yEdge = floor(y / this.voxelHeight);

            // Check upper edge
            if(y >= this.voxelHeight) {
                this.horEdges[xEdge][yEdge-1].iterate(iterFunc);
            }

            // Check right edge
            if(x < this.voxelWidth*(this.numHorVoxels-1)) {
                this.verEdges[xEdge][yEdge].iterate(iterFunc);
            }

            // Check lower edge
            if(y < this.voxelHeight*(this.numVerVoxels-1)) {
                this.horEdges[xEdge][yEdge].iterate(iterFunc);
            }

            // Check left edge
            if(x >= this.voxelWidth) {
                this.verEdges[xEdge-1][yEdge].iterate(iterFunc);
            }
        }

        // Return list
        return toReturn;
    }


    add(gameObj) {

        // Make sure gameObj has necessary variables
        if(typeof gameObj.x == "number" && typeof gameObj.y == "number" && typeof gameObj.width == "number" && typeof gameObj.height == "number") {

            // Add gameObj to instanceList
            let gameObjHolder = {
                gameObj: gameObj,
                voxel: null,
                edges: new LinkedList(this.eqFunc),
                collisions: new LinkedList(this.eqFunc)
            };
            this.instanceList.add(gameObjHolder);

            // Add gameObj to correct voxels and edges
            this.placeObj(gameObjHolder);

            // Return true to indicate success
            return true;
        }

        // If gameObj can't be added, return false
        return false;

    }


    remove(gameObj) {

        var gameObjsToReturn = [];

        // Remove gameObj from instanceList and get array of instanceList items that were removed
        var deleteList = this.removeInstances(gameObj);

        // Remove instances from instanceList and add to return list
        var instanceListRef = this.instanceList;
        deleteList.forEach(
            function(node) {
                // remove from instanceList
                instanceListRef.delete(
                    function(lowScopeNode) {
                        return lowScopeNode.data == node;
                    }
                );
                // add to return list
                gameObjsToReturn.push(node.gameObj);
            }
        )
        

        // Return list of gameObjs if any objects showed up or null if not
        if(gameObjsToReturn.length > 0)
            return gameObjsToReturn;
        return null;
    }


    destroy(gameObj) {

        // Remove gameObj from instanceList and get array of instanceList items that were removed
        var deleteList = this.removeInstances(gameObj);

        // Remove instances from instanceList
        var instanceListRef = this.instanceList;
        deleteList.forEach(
            function(node) {
                instanceListRef.delete(
                    function(lowScopeNode) {
                        return lowScopeNode.data == node;
                    }
                );
            }
        )
        
        // Return true if instances were removed, false otherwise
        return deleteList.length > 0;
    }


    count(gameObj) {

        var count = 0;

        var correctNestedFunction;
        if(typeof gameObj == "function")
            correctNestedFunction = function(node) {
                if(node.data.gameObj instanceof gameObj)
                    count++;
            }
        else
            correctNestedFunction = function(node) {
                if(node.data.gameObj == gameObj)
                    count++;
            }

        this.instanceList.iterate(correctNestedFunction);

        return count;
    }



    // HELPER METHODS

    placeObj(gameObjHolder) {

        this.placeObjInCorrectVoxel(gameObjHolder);
        this.placeObjInCorrectEdges(gameObjHolder);
    }


    placeObjInCorrectVoxel(gameObjHolder) {

        // Determine correct voxel
        var gameObj = gameObjHolder.gameObj;
        var centerX = gameObj.x + gameObj.width/2;
        var centerY = gameObj.y + gameObj.height/2;
        var correctXvoxel = Math.max(0, Math.min(Math.floor(centerX / this.voxelWidth), this.numHorVoxels-1));
        var correctYvoxel = Math.max(0, Math.min(Math.floor(centerY / this.voxelHeight), this.numVerVoxels-1));

        // Record correct voxel in gameObjHolder
        gameObjHolder.voxel = this.voxels[correctXvoxel][correctYvoxel];

        // Add to correct voxel
        this.voxels[correctXvoxel][correctYvoxel].add(gameObj);

    }


    placeObjInCorrectEdges(gameObjHolder) {

        // Determine correct edges
        var gameObj = gameObjHolder.gameObj;
        var edgeHorBegin = Math.floor(gameObj.x / this.voxelWidth);
        var edgeHorEnd = Math.floor((gameObj.x + gameObj.width) / this.voxelWidth);
        var edgeVerBegin = Math.floor(gameObj.y / this.voxelHeight);
        var edgeVerEnd = Math.floor((gameObj.y + gameObj.height) / this.voxelHeight);

        // Add to correct horizontal edges
        for(var i = Math.max(0, edgeHorBegin); i <= Math.min(edgeHorEnd, this.numHorVoxels-1); i++) {

            for(var e = Math.max(0, edgeVerBegin); e < Math.min(edgeVerEnd, this.numVerVoxels-1); e++) {

                // Record correct edge in gameObjHolder
                gameObjHolder.edges.add(this.horEdges[i][e]);

                // Actually add gameObj to the edge
                this.horEdges[i][e].add(gameObj);
            }
        }

        // Add to correct vertical edges
        for(var i = Math.max(0, edgeHorBegin); i < Math.min(edgeHorEnd, this.numHorVoxels-1); i++) {

            for(var e = Math.max(0, edgeVerBegin); e <= Math.min(edgeVerEnd, this.numVerVoxels-1); e++) {

                // Record correct edge in gameObjHolder
                gameObjHolder.edges.add(this.verEdges[i][e]);

                // Actually add gameObj to the edge
                this.verEdges[i][e].add(gameObj);
            }
        }
    }


    clearVoxelsAndEdges() {

        // Clear voxels
        for(var i = 0; i < this.numHorVoxels; i++) {
        
            for(var e = 0; e < this.numVerVoxels; e++) {

                this.voxels[i][e].clear();
            }
        }

        // Clear horizontal edges
        for(var i = 0; i < this.numHorVoxels; i++) {

            for(var e = 0; e < this.numVerVoxels-1; e++) {

                this.horEdges[i][e].clear();
            }
        }

        // Clear vertical edges
        for(var i = 0; i < this.numHorVoxels-1; i++) {

            for(var e = 0; e < this.numVerVoxels; e++) {

                this.verEdges[i][e].clear();
            }
        }

    }


    getDownHorEdge(x, y) {
        var voxX = Math.floor(x / this.voxelWidth);
        var voxY = Math.floor(y / this.voxelHeight);
        if(voxX >= 0 && voxY >= 0 && voxX < this.numHorVoxels && voxY < this.numVerVoxels-1)
            return this.horEdges[voxX][voxY];
        return null;
    }


    getLeftVerEdge(x, y) {
        var voxX = Math.floor(x / this.voxelWidth)-1;
        var voxY = Math.floor(y / this.voxelHeight);
        if(voxX >= 0 && voxY >= 0 && voxX < this.numHorVoxels-1 && voxY < this.numVerVoxels)
            return this.verEdges[voxX][voxY];
        return null;        
    }


    getRightVerEdge(x, y) {
        var voxX = Math.floor(x / this.voxelWidth);
        var voxY = Math.floor(y / this.voxelHeight);
        if(voxX >= 0 && voxY >= 0 && voxX < this.numHorVoxels-1 && voxY < this.numVerVoxels)
            return this.verEdges[voxX][voxY];
        return null;        
    }


    getUpHorEdge(x, y) {
        var voxX = Math.floor(x / this.voxelWidth);
        var voxY = Math.floor(y / this.voxelHeight)-1;
        if(voxX >= 0 && voxY >= 0 && voxX < this.numHorVoxels && voxY < this.numVerVoxels-1)
            return this.horEdges[voxX][voxY];
        return null;
    }


    getVoxel(x, y) { 
        var voxX = Math.max(0, Math.min(Math.floor(x / this.voxelWidth), this.numHorVoxels-1));
        var voxY = Math.max(0, Math.min(Math.floor(y / this.voxelHeight), this.numHorVoxels-1));
        return this.voxels[voxX][voxY];
    }


    overlaps(px, py, x, y, width, height) {
        if(px <= x && x <= px+width && py <= y && y <= py + height)
            return true;
        return false;
    }

    removeInstances(gameObj) {

        // Methods to help with iterations
        var functionWhenObj = function(node) {return node.data == gameObj};
        var functionWhenClass = function(node) {return node.data instanceof gameObj};
        var functionToUse = (typeof gameObj == "object"? functionWhenObj:functionWhenClass);

        // Search instanceList for correct voxel
        var gameObjHolder;
        var deleteList = [];
        this.instanceList.iterate(
            function(node) {
                gameObjHolder = null;

                // add if gameObj is a specific instance and is the correct object
                if(typeof gameObj == "object") {
                    if(node.data.gameObj == gameObj)
                        gameObjHolder = node.data;
                }

                // add if gameObj is a class and object is from class
                else if(typeof gameObj == "function") {
                    if(node.data.gameObj instanceof gameObj)
                        gameObjHolder = node.data;
                }

                // Remove gameObj from voxels, edges, and instanceList
                if(gameObjHolder != null) {

                    // Remove from voxel
                    gameObjHolder.voxel.delete(functionToUse);

                    // Remove from edges
                    gameObjHolder.edges.iterate(
                        function(outerNode) {
                            outerNode.data.delete(
                                functionToUse
                            );
                        }
                    );
                    
                    // Remove from instanceList
                    deleteList.push(node.data);
                }

            }
        );

        // return deleteList
        return deleteList;
    }

}