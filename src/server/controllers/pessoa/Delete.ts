import { Request, Response } from 'express';
import { validation } from '../../shared/middleware/Validation';
import { pessoaValidation } from '../../shared/model';
import { TIdParam } from '../../shared/types/TIdParam';
import { StatusCodes } from 'http-status-codes';
import { EnameTable } from '../../shared/types/EnameTable';
import { pessoaProvider } from '../../database/providers/pessoa';
import { counter } from '../../shared/model/Counter';

const deleteValidation = validation({
    params: pessoaValidation.IdValidation,
});
const deleteById = async (req: Request<TIdParam>, res: Response) => {
    const { id } = req.params;
    if (!id) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ errors: { default: 'Parametro id deve ser informado' } });
    }
    const count = await counter(id, EnameTable.pessoa, 'deletar');

    if (count == 'id não encontrado') {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ errors: { default: 'id não encontrado' } });
    } else if (count == 'erro ao deletar registro') {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ errors: { default: 'erro ao deletar registro' } });
    }
    const deleteById = await pessoaProvider.deleteByID(id);

    if (deleteById instanceof Error) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ errors: { default: deleteById.message } });
    }
    return res.status(StatusCodes.OK).json(deleteById);
};
export { deleteValidation, deleteById };
