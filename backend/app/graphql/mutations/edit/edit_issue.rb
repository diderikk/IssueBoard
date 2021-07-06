module Mutations
	class Edit::EditIssue < GraphQL::Schema::Mutation
		include Authorize
		graphql_name "EditIssue"
		argument :attributes, Types::Input::IssueInputType, required: true
		argument :issue_id, ID, required: true, loads: Issue

		field :issue, Types::IssueType, null: true
		field :errors, [String], null: true

		def resolve(attributes:, issue:)
			(raise GraphQL::ExecutionError.new "No group with that id") if issue.nil?
			
			if issue.update(due_date: attributes.due_date)
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
		
		def load_issue(id)
			Issue.find(id)
		end

		private

		def authorized?(attributes:, issue:)
			issue_authorized?(issue.id, context);
		end

	end
end