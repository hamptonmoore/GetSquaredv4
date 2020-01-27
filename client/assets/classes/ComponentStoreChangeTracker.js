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