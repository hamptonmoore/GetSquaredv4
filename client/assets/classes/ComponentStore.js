export class ComponentStore {
    constructor(){
        this.components = new Map();
    }

    entityHasComponent(component, entityID){
        return this.components.get(component).has(entityID);
    }

    entityDeleteComponent(component, entityID){
        return this.components.get(component).delete(entityID);
    }

    getAllComponentsOfComponentType(component){
        return this.components.get(component);
    }

    entityGetComponent(component, entityID){
        return this.components.get(component).get(entityID);
    }

    entitySetComponent(component, entityID, entityComponent){
        this.components.get(component).set(entityID, entityComponent);
    }

    deleteEntity(entityID){
        for (let componentName of this.components.keys()){
            this.entityDeleteComponent(componentName, entityID);
        }
    }

    addEntity(entity){
        for (let component of entity.components){
            //
            if (!this.components.has(component.name)){
                this.components.set(component.name, new Map());
            }

            this.entitySetComponent(component.name, entity.id, component);
        }
    }
}