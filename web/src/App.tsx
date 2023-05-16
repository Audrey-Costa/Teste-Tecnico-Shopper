import axios from 'axios';
import './App.css'
import Logo from "./assets/Shopper_logo.png";
import { useForm, Controller } from "react-hook-form";
import { useState } from 'react';


function App() {
  const { control, handleSubmit, formState: { errors } } = useForm();
  const [disable, setDisable] = useState(true);

  function handleValidate(data: any){
    console.log(data)
    const requisition = axios.post('http://localhost:5000/validation', data)
    requisition.then((response) => {
      setDisable(false);
      return response;
    }).catch(function (error: any) {
			console.error(error);
		});
  }
  
  function handleAtualization(data: any){
    const options = {
      method: 'PUT',
      url: 'http://localhost:5000/product',
    }
    axios.request(options).then(function ({ data }: { data: Response }){
      setDisable(true);
      return data;
    }).catch(function (error: any) {
			console.error(error);
		});
  }

  const onSubmit = (data: any, e: any) => {
    if (e.nativeEvent.submitter.name === "validate") {
      handleValidate(data);
    } else if (e.nativeEvent.submitter.name === "atualization") {
      handleAtualization(data);
    }
  };

  return (
    <>
      <img src={Logo} alt="Shopper" className='logo'/>
      <p>Shopper</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div id='inputDiv'>
          <label htmlFor='input'>Importar Arquivo .CSV</label>
          <Controller
            name="file"
            control={control}
            render={({ field }) => (
              <input type="file" accept='.csv' id='input' {...field} />
            )}
          />
        </div>
        {errors.exampleRequired && <span>This field is required</span>}
        
        <button type='submit' name='validate'> VALIDAR </button>
        <button type='submit' name='atualization' disabled={disable}> ATUALIZAR </button>
      </form>
    </>
  );
}

export default App;
