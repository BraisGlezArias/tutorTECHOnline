import React from 'react';
import { useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/auth-context';
import { addRating } from '../../http/ratingsService';
import { RHFInput } from 'react-hook-form-input';
import Rating from '@material-ui/lab/Rating';
import Box from '@material-ui/core/Box';

import '../../css/form.css'

export function AddRating(params) {
    const history = useHistory();
    const { currentUser } = useAuth();

    const {
        handleSubmit,
        register,
        errors,
    } = useForm({
        mode: 'onBlur'
    });

    function handleAddRating(formData) {

        return addRating(params.aId, formData)
            .then(() => {
                history.push('/');
                history.push(`preguntas/${params.qId}`);
            })
    };

    return (
        <React.Fragment>
            <div className='formulario'>

                {(currentUser === null || currentUser.userId === params.aUId) &&
                    <Box component="fieldset" mb={3} borderColor="transparent">
                        <Rating name="rating" value={params.rating} readOnly />
                    </Box>
                }
                {currentUser !== null && currentUser.userId !== params.aUId &&
                    <RHFInput
                        id='rating'
                        as={<Box component='fieldset' mb={3} borderColor='transparent'>
                            <Rating
                                name='rating'
                                value={params.rating}
                                    precision={1}
                                    onChange={handleSubmit(handleAddRating)}
                                />
                            </Box>}
                        name='rating'
                        register={register}
                    />
                }
            </div>
        </React.Fragment>
    )
}