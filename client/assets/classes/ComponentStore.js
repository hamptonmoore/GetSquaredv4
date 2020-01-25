export class ComponentStore {
    constructor(){
        this.components = new Map();
    }

    doesEntityHaveComponent(component, entityID){
        return this.components.get(component).has(entityID);
    }

    deleteComponentsFromEntity(component, entityID){
        return this.components.get(component).delete(entityID);
    }

    getAllComponentsOfComponentType(component){
        return this.components.get(component) || new Map();
    }

    getComponentsFromEntity(component, entityID){
        return this.components.get(component).get(entityID);
    }

    setComponentsFromEntity(component, entityID, entityComponent){
        this.components.get(component).set(entityID, entityComponent);
    }

    deleteEntity(entityID){
        for (let componentName of this.components.keys()){
            this.deleteComponentsFromEntity(componentName, entityID);
        }
    }

    addEntity(entity){
        for (let component of entity.components){
            //
            if (!this.components.has(component.name)){
                this.components.set(component.name, new Map());
            }

            this.setComponentsFromEntity(component.name, entity.id, component);
        }
    }
}