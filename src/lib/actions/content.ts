"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  actionError,
  actionSuccess,
  blogCategorySchema,
  blogPostSchema,
  projectSchema,
  serviceSchema,
  testimonialSchema,
  type ActionResult,
} from "@/lib/validators";

export type ServiceInput = z.input<typeof serviceSchema>;
export type ProjectInput = z.input<typeof projectSchema>;
export type BlogCategoryInput = z.input<typeof blogCategorySchema>;
export type BlogPostInput = z.input<typeof blogPostSchema>;
export type TestimonialInput = z.input<typeof testimonialSchema>;

const idSchema = z.string().min(1);
const json = (value: unknown): Prisma.InputJsonValue =>
  value as unknown as Prisma.InputJsonValue;

function revalidateAll(paths: string[]) {
  for (const path of paths) revalidatePath(path);
}

async function logActivity(action: string, detail?: string) {
  try {
    await prisma.activityLog.create({ data: { action, detail } });
  } catch {
    // never block a mutation on activity logging
  }
}

// ---------------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------------

export async function createService(input: ServiceInput): Promise<ActionResult> {
  const parsed = serviceSchema.safeParse(input);
  if (!parsed.success) return actionError("Please correct the errors below.", z.flattenError(parsed.error).fieldErrors);
  try {
    await prisma.service.create({
      data: {
        title: parsed.data.title,
        slug: parsed.data.slug,
        icon: parsed.data.icon || null,
        image: parsed.data.image || null,
        shortDescription: parsed.data.shortDescription,
        description: parsed.data.description,
        benefits: json(parsed.data.benefits),
        process: json(parsed.data.process),
        isPublished: parsed.data.isPublished,
        featured: parsed.data.featured,
        sortOrder: parsed.data.sortOrder,
      },
    });
    await logActivity("Service created", parsed.data.title);
    revalidateAll(["/admin/services", "/", "/services"]);
    return actionSuccess("Service created.");
  } catch (error) {
    if (isUnique(error)) return actionError("A service with that slug already exists.");
    return actionError("Could not create the service.");
  }
}

export async function updateService(id: string, input: ServiceInput): Promise<ActionResult> {
  if (!idSchema.safeParse(id).success) return actionError("Invalid service id.");
  const parsed = serviceSchema.safeParse(input);
  if (!parsed.success) return actionError("Please correct the errors below.", z.flattenError(parsed.error).fieldErrors);
  try {
    await prisma.service.update({
      where: { id },
      data: {
        title: parsed.data.title,
        slug: parsed.data.slug,
        icon: parsed.data.icon || null,
        image: parsed.data.image || null,
        shortDescription: parsed.data.shortDescription,
        description: parsed.data.description,
        benefits: json(parsed.data.benefits),
        process: json(parsed.data.process),
        isPublished: parsed.data.isPublished,
        featured: parsed.data.featured,
        sortOrder: parsed.data.sortOrder,
      },
    });
    await logActivity("Service updated", parsed.data.title);
    revalidateAll(["/admin/services", "/", "/services", `/services/${parsed.data.slug}`]);
    return actionSuccess("Service updated.");
  } catch (error) {
    if (isUnique(error)) return actionError("A service with that slug already exists.");
    return actionError("Could not update the service.");
  }
}

export async function deleteService(id: string): Promise<ActionResult> {
  if (!idSchema.safeParse(id).success) return actionError("Invalid service id.");
  try {
    await prisma.service.delete({ where: { id } });
    await logActivity("Service deleted", id);
    revalidateAll(["/admin/services", "/", "/services"]);
    return actionSuccess("Service deleted.");
  } catch {
    return actionError("Could not delete the service.");
  }
}

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

export async function createProject(input: ProjectInput): Promise<ActionResult> {
  const parsed = projectSchema.safeParse(input);
  if (!parsed.success) return actionError("Please correct the errors below.", z.flattenError(parsed.error).fieldErrors);
  try {
    await prisma.project.create({
      data: {
        name: parsed.data.name,
        slug: parsed.data.slug,
        location: parsed.data.location,
        description: parsed.data.description,
        category: parsed.data.category,
        year: parsed.data.year ?? null,
        client: parsed.data.client || null,
        status: parsed.data.status,
        image: parsed.data.image || null,
        featured: parsed.data.featured,
        isPublished: parsed.data.isPublished,
        images: parsed.data.gallery.length
          ? { create: parsed.data.gallery.map((url, index) => ({ url, sortOrder: index })) }
          : undefined,
      },
    });
    await logActivity("Project created", parsed.data.name);
    revalidateAll(["/admin/projects", "/", "/projects"]);
    return actionSuccess("Project created.");
  } catch (error) {
    if (isUnique(error)) return actionError("A project with that slug already exists.");
    return actionError("Could not create the project.");
  }
}

export async function updateProject(id: string, input: ProjectInput): Promise<ActionResult> {
  if (!idSchema.safeParse(id).success) return actionError("Invalid project id.");
  const parsed = projectSchema.safeParse(input);
  if (!parsed.success) return actionError("Please correct the errors below.", z.flattenError(parsed.error).fieldErrors);
  try {
    await prisma.project.update({
      where: { id },
      data: {
        name: parsed.data.name,
        slug: parsed.data.slug,
        location: parsed.data.location,
        description: parsed.data.description,
        category: parsed.data.category,
        year: parsed.data.year ?? null,
        client: parsed.data.client || null,
        status: parsed.data.status,
        image: parsed.data.image || null,
        featured: parsed.data.featured,
        isPublished: parsed.data.isPublished,
        images: parsed.data.gallery.length
          ? {
              deleteMany: {},
              create: parsed.data.gallery.map((url, index) => ({ url, sortOrder: index })),
            }
          : { deleteMany: {} },
      },
    });
    await logActivity("Project updated", parsed.data.name);
    revalidateAll(["/admin/projects", "/", "/projects", `/projects/${parsed.data.slug}`]);
    return actionSuccess("Project updated.");
  } catch (error) {
    if (isUnique(error)) return actionError("A project with that slug already exists.");
    return actionError("Could not update the project.");
  }
}

export async function deleteProject(id: string): Promise<ActionResult> {
  if (!idSchema.safeParse(id).success) return actionError("Invalid project id.");
  try {
    await prisma.project.delete({ where: { id } });
    await logActivity("Project deleted", id);
    revalidateAll(["/admin/projects", "/", "/projects"]);
    return actionSuccess("Project deleted.");
  } catch {
    return actionError("Could not delete the project.");
  }
}

// ---------------------------------------------------------------------------
// Blog categories
// ---------------------------------------------------------------------------

export async function createBlogCategory(input: BlogCategoryInput): Promise<ActionResult> {
  const parsed = blogCategorySchema.safeParse(input);
  if (!parsed.success) return actionError("Please correct the errors below.", z.flattenError(parsed.error).fieldErrors);
  try {
    await prisma.blogCategory.create({ data: { name: parsed.data.name, slug: parsed.data.slug } });
    await logActivity("Blog category created", parsed.data.name);
    revalidateAll(["/admin/blog"]);
    return actionSuccess("Category created.");
  } catch (error) {
    if (isUnique(error)) return actionError("A category with that slug already exists.");
    return actionError("Could not create the category.");
  }
}

export async function updateBlogCategory(id: string, input: BlogCategoryInput): Promise<ActionResult> {
  if (!idSchema.safeParse(id).success) return actionError("Invalid category id.");
  const parsed = blogCategorySchema.safeParse(input);
  if (!parsed.success) return actionError("Please correct the errors below.", z.flattenError(parsed.error).fieldErrors);
  try {
    await prisma.blogCategory.update({ where: { id }, data: { name: parsed.data.name, slug: parsed.data.slug } });
    await logActivity("Blog category updated", parsed.data.name);
    revalidateAll(["/admin/blog"]);
    return actionSuccess("Category updated.");
  } catch (error) {
    if (isUnique(error)) return actionError("A category with that slug already exists.");
    return actionError("Could not update the category.");
  }
}

export async function deleteBlogCategory(id: string): Promise<ActionResult> {
  if (!idSchema.safeParse(id).success) return actionError("Invalid category id.");
  try {
    await prisma.blogCategory.delete({ where: { id } });
    await logActivity("Blog category deleted", id);
    revalidateAll(["/admin/blog"]);
    return actionSuccess("Category deleted.");
  } catch {
    return actionError("Could not delete the category. It may be in use by a post.");
  }
}

// ---------------------------------------------------------------------------
// Blog posts
// ---------------------------------------------------------------------------

export async function createBlogPost(input: BlogPostInput): Promise<ActionResult> {
  const parsed = blogPostSchema.safeParse(input);
  if (!parsed.success) return actionError("Please correct the errors below.", z.flattenError(parsed.error).fieldErrors);
  try {
    await prisma.blogPost.create({
      data: {
        title: parsed.data.title,
        slug: parsed.data.slug,
        image: parsed.data.image || null,
        excerpt: parsed.data.excerpt,
        content: parsed.data.content,
        author: parsed.data.author || "SAAJ Partners and Consult",
        categoryId: parsed.data.categoryId || null,
        tags: json(parsed.data.tags),
        isPublished: parsed.data.isPublished,
        publishedAt: parsed.data.isPublished ? (parsed.data.publishedAt ?? new Date()) : parsed.data.publishedAt,
        seoTitle: parsed.data.seoTitle || null,
        seoDescription: parsed.data.seoDescription || null,
      },
    });
    await logActivity("Blog post created", parsed.data.title);
    revalidateAll(["/admin/blog", "/", "/blog"]);
    return actionSuccess("Post created.");
  } catch (error) {
    if (isUnique(error)) return actionError("A post with that slug already exists.");
    return actionError("Could not create the post.");
  }
}

export async function updateBlogPost(id: string, input: BlogPostInput): Promise<ActionResult> {
  if (!idSchema.safeParse(id).success) return actionError("Invalid post id.");
  const parsed = blogPostSchema.safeParse(input);
  if (!parsed.success) return actionError("Please correct the errors below.", z.flattenError(parsed.error).fieldErrors);
  try {
    await prisma.blogPost.update({
      where: { id },
      data: {
        title: parsed.data.title,
        slug: parsed.data.slug,
        image: parsed.data.image || null,
        excerpt: parsed.data.excerpt,
        content: parsed.data.content,
        author: parsed.data.author || "SAAJ Partners and Consult",
        categoryId: parsed.data.categoryId || null,
        tags: json(parsed.data.tags),
        isPublished: parsed.data.isPublished,
        publishedAt: parsed.data.isPublished ? (parsed.data.publishedAt ?? new Date()) : parsed.data.publishedAt,
        seoTitle: parsed.data.seoTitle || null,
        seoDescription: parsed.data.seoDescription || null,
      },
    });
    await logActivity("Blog post updated", parsed.data.title);
    revalidateAll(["/admin/blog", "/", "/blog", `/blog/${parsed.data.slug}`]);
    return actionSuccess("Post updated.");
  } catch (error) {
    if (isUnique(error)) return actionError("A post with that slug already exists.");
    return actionError("Could not update the post.");
  }
}

export async function deleteBlogPost(id: string): Promise<ActionResult> {
  if (!idSchema.safeParse(id).success) return actionError("Invalid post id.");
  try {
    await prisma.blogPost.delete({ where: { id } });
    await logActivity("Blog post deleted", id);
    revalidateAll(["/admin/blog", "/", "/blog"]);
    return actionSuccess("Post deleted.");
  } catch {
    return actionError("Could not delete the post.");
  }
}

// ---------------------------------------------------------------------------
// Testimonials
// ---------------------------------------------------------------------------

export async function createTestimonial(input: TestimonialInput): Promise<ActionResult> {
  const parsed = testimonialSchema.safeParse(input);
  if (!parsed.success) return actionError("Please correct the errors below.", z.flattenError(parsed.error).fieldErrors);
  try {
    await prisma.testimonial.create({
      data: {
        name: parsed.data.name,
        role: parsed.data.role || null,
        company: parsed.data.company || null,
        content: parsed.data.content,
        rating: parsed.data.rating,
        image: parsed.data.image || null,
        isPublished: parsed.data.isPublished,
        isDemo: parsed.data.isDemo,
        sortOrder: parsed.data.sortOrder,
      },
    });
    await logActivity("Testimonial created", parsed.data.name);
    revalidateAll(["/admin/testimonials", "/"]);
    return actionSuccess("Testimonial created.");
  } catch {
    return actionError("Could not create the testimonial.");
  }
}

export async function updateTestimonial(id: string, input: TestimonialInput): Promise<ActionResult> {
  if (!idSchema.safeParse(id).success) return actionError("Invalid testimonial id.");
  const parsed = testimonialSchema.safeParse(input);
  if (!parsed.success) return actionError("Please correct the errors below.", z.flattenError(parsed.error).fieldErrors);
  try {
    await prisma.testimonial.update({
      where: { id },
      data: {
        name: parsed.data.name,
        role: parsed.data.role || null,
        company: parsed.data.company || null,
        content: parsed.data.content,
        rating: parsed.data.rating,
        image: parsed.data.image || null,
        isPublished: parsed.data.isPublished,
        isDemo: parsed.data.isDemo,
        sortOrder: parsed.data.sortOrder,
      },
    });
    await logActivity("Testimonial updated", parsed.data.name);
    revalidateAll(["/admin/testimonials", "/"]);
    return actionSuccess("Testimonial updated.");
  } catch {
    return actionError("Could not update the testimonial.");
  }
}

export async function deleteTestimonial(id: string): Promise<ActionResult> {
  if (!idSchema.safeParse(id).success) return actionError("Invalid testimonial id.");
  try {
    await prisma.testimonial.delete({ where: { id } });
    await logActivity("Testimonial deleted", id);
    revalidateAll(["/admin/testimonials", "/"]);
    return actionSuccess("Testimonial deleted.");
  } catch {
    return actionError("Could not delete the testimonial.");
  }
}

function isUnique(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && (error as { code?: string }).code === "P2002";
}