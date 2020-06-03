import React, {useEffect, useState} from 'react';
import './App.css';
import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import ButtonToolbar from 'react-bootstrap/ButtonToolbar'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'


function App() {
  
    const [recipes,setRecipes]=useState([]);
    const [showAdd, setShowAdd] = useState(false);
    const [showUpdate, setShowUpdate] = useState(false);
    const [newRecipe,setNewRecipe] = useState({title:'',ingredients:[]});
    const [updatedRecipe,setUpdatedRecipe] = useState({title:'',ingredients:[]});
    const [updatedKey,setUpdatedKey] = useState(); 

    const handleCloseAdd = () => setShowAdd(false);
    const handleShowAdd = () => setShowAdd(true);

    const handleCloseUpdate = () => setShowUpdate(false);
    const handleShowUpdate = (index) => {
      setShowUpdate(true);
      setUpdatedKey(index);
      setUpdatedRecipe(recipes[index]);
    }

    //Form validation
    const handleSubmit = (Recipe) => {
      if(Recipe.title=="" || Recipe.ingredients.length == 0){
        return false;
      }
      else
      return true;
    }
    
    //Delete a recipe
    const deleteRecipe = (index) => {
      const tmp_recipes = recipes.slice();
      tmp_recipes.splice(index,1);
      componentWillUpdate( tmp_recipes);
      setRecipes(tmp_recipes);
    }

    const updateNewRecipe = (title,ingredients) => {
      setNewRecipe({title,ingredients});
    }
    
    // Create recipe
    const addRecipe = (event) => {
      event.preventDefault();
      if(handleSubmit(newRecipe)){
        const tmp_recipes = recipes.slice();
        tmp_recipes.push(newRecipe);
        componentWillUpdate( tmp_recipes);
        setRecipes(tmp_recipes);
        setNewRecipe({title:'',ingredients:[]});
        handleCloseAdd(); 
      }
    }

    // Edit Recipe
    const editRecipe = (event) => { 
      event.preventDefault();
      if(handleSubmit(updatedRecipe)){
        const tmp_recipes = recipes ;
        tmp_recipes[updatedKey] = updatedRecipe;
        componentWillUpdate( tmp_recipes);
        setRecipes(tmp_recipes); 
        setUpdatedRecipe({title:'',ingredients:[]});
        handleCloseUpdate(); 
      }
    }

      //Reset the form fields
      const ResetRecipe = (event)=>{
        event.preventDefault();
        setNewRecipe({title:'',ingredients:[]});
      }
    
      //Local storage
      const componentWillUpdate = (recipes) => {
         if(storageAvailable('localStorage')) {
            const ref = localStorage.setItem('recipes', JSON.stringify(recipes)) 
          } 
          else {
             console.error('Your browser doesn\'t support local storage');
             } 
        } 
        const componentWillMount = () => {
           if(storageAvailable('localStorage')) {
              const localRef = localStorage.getItem('recipes', JSON.stringify(recipes));
               if(localRef) {
                 console.log(JSON.parse(localRef));
                  setRecipes(JSON.parse(localRef)) ;
                } 
              } 
            else {
               console.error('Your browser doesn\'t support local storage'); 
              } 
          }
          function storageAvailable(type) {
            try {
                var storage = window[type],
                    x = '__storage_test__';
                storage.setItem(x, x);
                storage.removeItem(x);
                return true;
            }
            catch(e) {
                return e instanceof DOMException && (
                    // everything except Firefox
                    e.code === 22 ||
                    // Firefox
                    e.code === 1014 ||
                    // test name field too, because code might not be present
                    // everything except Firefox
                    e.name === 'QuotaExceededError' ||
                    // Firefox
                    e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
                    // acknowledge QuotaExceededError only if there's something already stored
                    storage.length !== 0;
            }
        }
  
        useEffect(()=>{
          componentWillMount();
        },recipes)

  return (
    <div className="App container">
      <h1>Welcom To Recipe Box</h1>
      {recipes.length > 0 && 
        <div className="content">
          <Accordion>
            {recipes.map((recipe,index)=>(
              <Card key={index} >
                <Card.Header>
                  <Accordion.Toggle as={Button} variant="light" eventKey={index}>
                    {recipe.title}
                  </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey={index}>
                  <Card.Body>
                    <ol>
                      {recipes[index].ingredients.map((item)=>
                      <li key ={item}>
                        {item}
                      </li>
                      )}
                    </ol>
                    <ButtonToolbar>
                      <OverlayTrigger overlay={<Tooltip> Delete this recipe </Tooltip>   }>
                        <Button variant="danger" onClick={(event)=>deleteRecipe(index)} ><img src="./delete.svg"/></Button>
                      </OverlayTrigger>
                      <OverlayTrigger overlay={<Tooltip>Edit this recipe</Tooltip>}>
                        <Button variant="dark" onClick={(event)=>handleShowUpdate(index)}><img src="./edit.svg"/></Button>
                      </OverlayTrigger>
                    </ButtonToolbar>
                  </Card.Body>
                </Accordion.Collapse>
            </Card>
            ))}
          </Accordion>
        </div>
        }
      <Modal show={showAdd} onHide={handleCloseAdd}>
        <Modal.Header closeButton>
          <Modal.Title>Add a new recipe</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="title">
              <Form.Label>Recipe title</Form.Label>
              <Form.Control required type="text" placeholder="Enter title" value={newRecipe.title} onChange={(event) => updateNewRecipe(event.target.value,newRecipe.ingredients) }/>
            </Form.Group>
            <Form.Group controlId="ingrdirnts">
              <Form.Label>Ingredients (each sepreated by a comma)</Form.Label>
              <Form.Control as="textarea" placeholder="ingredient 1, ingredient 2..." value={newRecipe.ingredients}   onChange={(event) => updateNewRecipe(newRecipe.title,event.target.value.split(","))} required/>
            </Form.Group>
            <hr style={{color: "#dee2e6",backgroundColor: "#dee2e6" }} />
            <ButtonToolbar>
              <Button variant="primary" type="submit" onClick={(event)=> addRecipe(event)}>Submit</Button>
              <Button variant="secondary" type="reset" onClick={(event)=>ResetRecipe(event)}>Reset</Button>  
            </ButtonToolbar>             
          </Form>
        </Modal.Body>
      </Modal>    
      <Modal show={showUpdate} onHide={handleCloseUpdate}>
        <Modal.Header closeButton>
          <Modal.Title>Update a recipe</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="title">
              <Form.Label>Recipe title</Form.Label>
              <Form.Control type="text" placeholder="Enter title" value={updatedRecipe.title} onChange={(event) => setUpdatedRecipe({title:event.target.value,ingrdients:updatedRecipe.ingredients}) } required/>
            </Form.Group>
            <Form.Group controlId="ingrdirnts">
              <Form.Label>Ingredients (each sepreated by a comma)</Form.Label>
              <Form.Control as="textarea" placeholder="ingredient 1, ingredient 2..." value={updatedRecipe.ingredients}  onChange={(event) => setUpdatedRecipe({title:updatedRecipe.title,ingredients:event.target.value.split(",")}) } required/>
            </Form.Group>
            <hr style={{color: "#dee2e6",backgroundColor: "#dee2e6" }} />
            <ButtonToolbar>
              <Button variant="primary" type="submit" onClick={(event)=>editRecipe(event)}>Update</Button>
            </ButtonToolbar>               
          </Form>
        </Modal.Body>
      </Modal>
      <div className="footer">
        <Button variant="light" onClick={handleShowAdd}><img src="./plus.svg" width="20px" height="20px"/>New recipe</Button>
      </div>
      
    </div>
  );
}

export default App;
