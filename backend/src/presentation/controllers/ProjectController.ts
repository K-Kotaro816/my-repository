import { Response, NextFunction } from 'express';
import { CreateProject } from '../../application/usecases/CreateProject';
import { ListProjects } from '../../application/usecases/ListProjects';
import { GetProject } from '../../application/usecases/GetProject';
import { UpdateProject } from '../../application/usecases/UpdateProject';
import { DeleteProject } from '../../application/usecases/DeleteProject';
import { UploadFloorPlan } from '../../application/usecases/UploadFloorPlan';
import { DeleteFloorPlan } from '../../application/usecases/DeleteFloorPlan';
import { AuthRequest } from '../middleware/authMiddleware';

export class ProjectController {
  constructor(
    private createProject: CreateProject,
    private listProjects: ListProjects,
    private getProject: GetProject,
    private updateProject: UpdateProject,
    private deleteProject: DeleteProject,
    private uploadFloorPlanUseCase: UploadFloorPlan,
    private deleteFloorPlanUseCase: DeleteFloorPlan,
  ) {}

  create = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const project = await this.createProject.execute({
        userId: req.userId!,
        ...req.body,
      });
      res.status(201).json(project);
    } catch (error) {
      next(error);
    }
  };

  list = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const projects = await this.listProjects.execute(req.userId!);
      res.json(projects);
    } catch (error) {
      next(error);
    }
  };

  get = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const project = await this.getProject.execute(req.params.id, req.userId!);
      res.json(project);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('見つかりません')) {
          res.status(404).json({ message: error.message });
          return;
        }
        if (error.message.includes('アクセス権')) {
          res.status(403).json({ message: error.message });
          return;
        }
      }
      next(error);
    }
  };

  update = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const project = await this.updateProject.execute({
        projectId: req.params.id,
        userId: req.userId!,
        data: req.body,
      });
      res.json(project);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('見つかりません')) {
          res.status(404).json({ message: error.message });
          return;
        }
        if (error.message.includes('アクセス権')) {
          res.status(403).json({ message: error.message });
          return;
        }
      }
      next(error);
    }
  };

  uploadFloorPlan = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ message: '画像ファイルが必要です' });
        return;
      }
      const relativePath = `projects/${req.params.id}/${req.file.filename}`;
      const project = await this.uploadFloorPlanUseCase.execute({
        projectId: req.params.id,
        userId: req.userId!,
        filePath: relativePath,
      });
      res.json(project);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('見つかりません')) {
          res.status(404).json({ message: error.message });
          return;
        }
        if (error.message.includes('アクセス権')) {
          res.status(403).json({ message: error.message });
          return;
        }
        if (error.message.includes('ファイル形式')) {
          res.status(400).json({ message: error.message });
          return;
        }
      }
      next(error);
    }
  };

  deleteFloorPlan = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const project = await this.deleteFloorPlanUseCase.execute(req.params.id, req.userId!);
      res.json(project);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('見つかりません')) {
          res.status(404).json({ message: error.message });
          return;
        }
        if (error.message.includes('アクセス権')) {
          res.status(403).json({ message: error.message });
          return;
        }
      }
      next(error);
    }
  };

  remove = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.deleteProject.execute(req.params.id, req.userId!);
      res.status(204).send();
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('見つかりません')) {
          res.status(404).json({ message: error.message });
          return;
        }
        if (error.message.includes('アクセス権')) {
          res.status(403).json({ message: error.message });
          return;
        }
      }
      next(error);
    }
  };
}
