import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { MulterError } from 'multer';

@Catch(MulterError, Error)
export class MulterExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    const status = 400;
    let message = 'Erreur upload';

    if (exception instanceof MulterError) {
      switch (exception.code) {
        case 'LIMIT_FILE_SIZE':
          message = 'Fichier trop volumineux (6MB maximum)';
          break;
        case 'LIMIT_UNEXPECTED_FILE':
          message = 'Fichier inattendu';
          break;
        default:
          message = `Erreur upload: ${exception.code}`;
      }
    } else if (exception instanceof Error) {
      if (exception.message === 'Invalid file type' || exception.message === 'Invalid file extension') {
        message = 'Type de fichier non autorisé (PNG ou JPEG uniquement)';
      } else {
        // Pour toute autre erreur générique côté filtre
        message = exception.message || message;
      }
    }

    // Utiliser une BadRequestException standardisée
    const payload = new BadRequestException(message).getResponse();
    res.status(status).json(payload);
  }
}
