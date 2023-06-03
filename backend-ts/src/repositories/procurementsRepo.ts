import { PrismaClient, Prisma } from "@prisma/client"
import { merge } from "lodash"
import {
  activeRowCriteria,
  deletedRowCriteria,
  metaFields,
} from "./recordConfig"

const prisma = new PrismaClient()

// FIELDS SELECTION

// DB MANIPULATION FUNCTIONS
