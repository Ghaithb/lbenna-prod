export class UpdateProjectDto {
  slug?: string;
  title?: string;
  summary?: string;
  content?: any;
  imageUrl?: string;
  tags?: string[];
  published?: boolean;
}
