module Mutations
	class Create::CreateIssue < GraphQL::Schema::Mutation
		graphql_name "CreateIssue"
		argument :attributes, Types::Input::IssueInputType, required: true

		field :issue, Types::IssueType, null: true
		field :errors, [String], null: true

		def resolve(attributes:)
			issue = Issue.new(title: attributes.title, description: attributes.description, due_date: attributes.due_date, issue_label_id: attributes.issue_label_id)

			last_issue = Issue.where(issue_label_id: attributes.issue_label_id).last
			issue.issue_id = (last_issue.nil?) ? 1 : last_issue.issue_id+1

			if issue.save!
				{
					issue: issue,
					errors: nil,
				}
			else
				{
					issue: nil,
					errors: issue.errors.full_messages,
				}
			end
		end
	end
end