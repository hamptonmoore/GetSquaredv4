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

    // noinspection JSUnusedGlobalSymbols
    optimize(){
        this.state.changes = this.removeDuplicates(this.state.changes);
        this.state.creations = this.removeDuplicates(this.state.creations);
        this.state.deletions = this.removeDuplicates(this.state.deletions);
    }

    addChangeToComponent(componentName, entityID, key, value){
        this.state.changes.push([componentName, entityID, key, value]);
    }

    addComponentCreation(component, entityID){
        this.state.creations.push([entityID, ...Object.keys(component), ...Object.values(component)]);
    }

    deleteComponent(componentName, entityID){
        this.state.deletions.push([componentName, entityID]);
    }
}