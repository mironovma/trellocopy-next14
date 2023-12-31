import { z } from "zod";
import { CardFile } from "@prisma/client";

import { ActionState } from "@/lib/create-safe-action";

import { UploadFile } from "./schema";

export type InputType = z.infer<typeof UploadFile>;
export type ReturnType = ActionState<InputType, CardFile>;
