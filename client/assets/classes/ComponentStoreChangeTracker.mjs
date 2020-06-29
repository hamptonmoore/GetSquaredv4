export class ComponentStoreChangeTracker {
    constructor(){
        this.state = {};
        this.emptyState();
    }

    emptyState(){
        this.state = {
            changes: [],   // contains [componentName, entityID, key, value]
            creations: [], // contains [entityID, key, key, value, value] componentName can be found in the key value pair of "name"
            deletions: []  // contains [componentName, entityID]
        }
    }

    // noinspection JSMethodCanBeStatic
    removeDuplicates(arrayToChange){
        arrayToChange = arrayToChange.reverse();

        arrayToChange = arrayToChange.filter((item, currentIndex, originalArray)=>{

            for (let checkIndex = 0; checkIndex < originalArray.length; checkIndex++){
                if (originalArray[checkIndex][0] === item[0] && originalArray[checkIndex][1] === item[1] && originalArray[checkIndex][2] === item[2] && checkIndex < currentIndex){
                    return false;
                }
            }

            return true;
        });

        return arrayToChange;
    }

    removeDeleted(arrayToDeleteFrom, arrayOfDeletions){

        arrayToDeleteFrom = arrayToDeleteFrom.filter((item)=>{

            for (let checkIndex = 0; checkIndex < arrayOfDeletions.length; checkIndex++){
                if (item[1] === arrayOfDeletions[checkIndex][1]){
                    return false;
                }
            }

            return true;
        });

        return arrayToDeleteFrom;
    }

    // noinspection JSUnusedGlobalSymbols
    optimize(){
        this.state.changes = this.removeDuplicates(this.state.changes);
        this.state.changes = this.removeDeleted(this.state.changes, this.state.deletions);
    }

    addChangeToComponent(componentName, entityID, key, value){
        this.state.changes.push([componentName, entityID, key, value]);
    }

    addComponentCreation(entity){
        this.state.creations.push([entity.type, entity.id, ...entity.arguments]);
    }

    deleteComponent(componentName, entityID){
        this.state.deletions.push([componentName, entityID]);
    }
}